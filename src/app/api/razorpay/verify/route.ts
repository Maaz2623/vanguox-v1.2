import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { subscriptionsTable, user } from "@/db/schema";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authData) {
      throw new Error("Unauthorized");
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET!;

    // ✅ Generate signature
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature === razorpay_signature) {
      // Payment verified

      await db.insert(subscriptionsTable).values({
        userId: authData.user.id,
        subscriptionType: "pro",
      });

      await db
        .update(user)
        .set({
          maxTokens: 1000000,
          totalTokensUsed: 0,
        })
        .where(eq(user.id, authData.user.id));

      return NextResponse.json({ success: true, message: "Payment verified" });
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

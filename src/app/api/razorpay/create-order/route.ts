import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { amount, currency } = await req.json();

  const options = {
    amount: amount * 100, // paise
    currency,
    receipt: "receipt#1",
  };

  const order = await razorpay.orders.create(options);

  return NextResponse.json(order);
}

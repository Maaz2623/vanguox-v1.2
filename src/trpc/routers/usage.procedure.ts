import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";

export const usageRouter = createTRPCRouter({
  getUsage: baseProcedure.query(async () => {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authData) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const [result] = await db
      .select({ usage: user.usage })
      .from(user)
      .where(eq(user.id, authData.user.id));

    return result.usage;
  }),
});

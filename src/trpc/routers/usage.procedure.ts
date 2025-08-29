import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
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

    if (!authData) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const [result] = await db
      .select({ usedTokens: user.totalTokensUsed })
      .from(user)
      .where(eq(user.id, authData.user.id));

    return result.usedTokens;
  }),
  getMaxTokens: baseProcedure.query(async () => {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authData) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    if (!authData) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const [result] = await db
      .select({ maxTokens: user.maxTokens })
      .from(user)
      .where(eq(user.id, authData.user.id));

    return result.maxTokens;
  }),
});

import { auth } from "@/lib/auth/auth";
import { baseProcedure, createTRPCRouter } from "../init";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { subscriptionsTable } from "@/db/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";

export const subscriptionRouter = createTRPCRouter({
  getCurrentSubscription: baseProcedure.query(async () => {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authData) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const [currentSubscription] = await db
      .select()
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.userId, authData.user.id),
          lte(subscriptionsTable.billingCycleStart, sql`now()`),
          gte(subscriptionsTable.billingCycleEnd, sql`now()`)
        )
      );

    if (!currentSubscription) {
      return null;
    }

    return currentSubscription;
  }),
});

import { auth } from "@/lib/auth/auth";
import { baseProcedure, createTRPCRouter } from "../init";
import { headers } from "next/headers";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { filesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const filesRouter = createTRPCRouter({
  getFiles: baseProcedure.query(async () => {
    const authData = await auth.api.getSession({
      headers: await headers(),
    });

    if (!authData) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }

    const files = await db
      .select()
      .from(filesTable)
      .where(eq(filesTable.userId, authData.user.id));

    return files;
  }),
});

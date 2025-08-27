import { db } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const usageRouter = createTRPCRouter({
  getUsage: baseProcedure.query(async () => {
    const [result] = await db
      .select({ usage: user.usage })
      .from(user)
      .where(eq(user.id, "jBIuBAtupQ6WUcQXeiOBwGVNe8XMnjbS"));

    return result.usage;
  }),
});

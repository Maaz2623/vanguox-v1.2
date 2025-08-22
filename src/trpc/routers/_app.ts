import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { db } from "@/db";
import { eq } from "drizzle-orm";
export const appRouter = createTRPCRouter({});
// export type definition of API
export type AppRouter = typeof appRouter;

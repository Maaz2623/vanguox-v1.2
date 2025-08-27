import { createTRPCRouter } from "../init";
import { usageRouter } from "./usage.procedure";
export const appRouter = createTRPCRouter({
    usage: usageRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;

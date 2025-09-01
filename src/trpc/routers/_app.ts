import { createTRPCRouter } from "../init";
import { filesRouter } from "./files.procedure";
import { subscriptionRouter } from "./subscription.procedure";
import { usageRouter } from "./usage.procedure";
export const appRouter = createTRPCRouter({
    usage: usageRouter,
    subscription: subscriptionRouter,
    files: filesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;

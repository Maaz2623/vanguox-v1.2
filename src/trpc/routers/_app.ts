import { createTRPCRouter } from "../init";
import { subscriptionRouter } from "./subscription.procedure";
import { usageRouter } from "./usage.procedure";
export const appRouter = createTRPCRouter({
    usage: usageRouter,
    subscription: subscriptionRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;

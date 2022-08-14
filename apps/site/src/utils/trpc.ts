import type { SiteRouter } from "@sst-app/trpc-mux";
import { createMuxLinksForSite } from "@sst-app/trpc-mux";
import { createReactQueryHooks, createTRPCClient } from "@trpc/react";
import type {
  inferProcedureInput,
  inferProcedureOutput,
  inferSubscriptionOutput,
} from "@trpc/server";
import superjson from "superjson";

export const trpc = createReactQueryHooks<SiteRouter>();

export const trpcClient = createTRPCClient({
  links: createMuxLinksForSite(import.meta.env.VITE_API_URL),
  transformer: superjson,
});

/**
 * Enum containing all api query paths.
 */
export type TQuery = keyof SiteRouter["_def"]["queries"];

/**
 * Enum containing all api mutation paths.
 */
export type TMutation = keyof SiteRouter["_def"]["mutations"];

/**
 * Enum containing all api subscription paths.
 */
export type TSubscription = keyof SiteRouter["_def"]["subscriptions"];

/**
 * This is a helper method to infer the output of a query resolver.
 * @example type HelloOutput = InferQueryOutput<'hello'>
 */
export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  SiteRouter["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the input of a query resolver.
 * @example type HelloInput = InferQueryInput<'hello'>
 */
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  SiteRouter["_def"]["queries"][TRouteKey]
>;

/**
 * This is a helper method to infer the output of a mutation resolver.
 * @example type HelloOutput = InferMutationOutput<'hello'>
 */
export type InferMutationOutput<TRouteKey extends TMutation> = inferProcedureOutput<
  SiteRouter["_def"]["mutations"][TRouteKey]
>;

/**
 * This is a helper method to infer the input of a mutation resolver.
 * @example type HelloInput = InferMutationInput<'hello'>
 */
export type InferMutationInput<TRouteKey extends TMutation> = inferProcedureInput<
  SiteRouter["_def"]["mutations"][TRouteKey]
>;

/**
 * This is a helper method to infer the output of a subscription resolver.
 * @example type HelloOutput = InferSubscriptionOutput<'hello'>
 */
export type InferSubscriptionOutput<TRouteKey extends TSubscription> = inferProcedureOutput<
  SiteRouter["_def"]["subscriptions"][TRouteKey]
>;

/**
 * This is a helper method to infer the asynchronous output of a subscription resolver.
 * @example type HelloAsyncOutput = InferAsyncSubscriptionOutput<'hello'>
 */
export type InferAsyncSubscriptionOutput<TRouteKey extends TSubscription> = inferSubscriptionOutput<
  SiteRouter,
  TRouteKey
>;

/**
 * This is a helper method to infer the input of a subscription resolver.
 * @example type HelloInput = InferSubscriptionInput<'hello'>
 */
export type InferSubscriptionInput<TRouteKey extends TSubscription> = inferProcedureInput<
  SiteRouter["_def"]["subscriptions"][TRouteKey]
>;

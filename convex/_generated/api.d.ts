/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as customers from "../customers.js";
import type * as http from "../http.js";
import type * as products from "../products.js";
import type * as quotes from "../quotes.js";
import type * as reports from "../reports.js";
import type * as router from "../router.js";
import type * as sampleData from "../sampleData.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  customers: typeof customers;
  http: typeof http;
  products: typeof products;
  quotes: typeof quotes;
  reports: typeof reports;
  router: typeof router;
  sampleData: typeof sampleData;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

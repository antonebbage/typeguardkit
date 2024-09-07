// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { ObjectAsserter } from "./object_asserter.ts";
import { PartialAsserter } from "./partial_asserter.ts";

/**
 * `partial` can be used to create a `PartialAsserter` without specifying a
 * `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, Asserted, ObjectAsserter, partial } from "typeguardkit";
 *
 * // types/user_name.ts
 *
 * export const _UserName = new ObjectAsserter("UserName", {
 *   firstName: _string,
 *   lastName: _string,
 * });
 *
 * export type UserName = Asserted<typeof _UserName>;
 *
 * // types/user_name_update.ts
 *
 * export const _UserNameUpdate = partial(_UserName);
 *
 * export type UserNameUpdate = Asserted<typeof _UserNameUpdate>;
 * ```
 */
export function partial<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
>(
  asserter: ObjectAsserter<PropertyAsserters>,
): PartialAsserter<PropertyAsserters> {
  return new PartialAsserter(`Partial<${asserter.typeName}>`, asserter);
}

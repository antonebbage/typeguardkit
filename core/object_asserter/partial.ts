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
 * import { _string, ObjectAsserter, partial } from "../../mod.ts";
 *
 * // types/user_name.ts
 *
 * export const _UserName = new ObjectAsserter("UserName", {
 *   firstName: _string,
 *   lastName: _string,
 * });
 *
 * export type UserName = ReturnType<typeof _UserName.assert>;
 *
 * // types/user_name_update.ts
 *
 * export const _UserNameUpdate = partial(_UserName);
 *
 * export type UserNameUpdate = ReturnType<typeof _UserNameUpdate.assert>;
 * ```
 */
export function partial<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
>(
  asserter: ObjectAsserter<PropertyAsserters>,
): PartialAsserter<PropertyAsserters> {
  return new PartialAsserter(`Partial<${asserter.typeName}>`, asserter);
}

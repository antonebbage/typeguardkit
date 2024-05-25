// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { ObjectAsserter } from "./object_asserter.ts";
import { PickAsserter } from "./pick_asserter.ts";

/**
 * `pick` can be used to create a `PickAsserter` without specifying a
 * `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, ObjectAsserter, pick } from "../../mod.ts";
 *
 * // types/user.ts
 *
 * export const _User = new ObjectAsserter("User", {
 *   id: _string,
 *   firstName: _string,
 *   lastName: _string,
 * });
 *
 * export type User = ReturnType<typeof _User.assert>;
 *
 * // types/user_name.ts
 *
 * export const _UserName = pick(_User, ["firstName", "lastName"]);
 *
 * export type UserName = ReturnType<typeof _UserName.assert>;
 * ```
 */
export function pick<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
  Keys extends Array<keyof PropertyAsserters>,
>(
  asserter: ObjectAsserter<PropertyAsserters>,
  keys: Keys,
): PickAsserter<PropertyAsserters, Keys> {
  const typeName = `Pick<${asserter.typeName}, ${
    keys.map((key) => `"${String(key)}"`).join(" | ")
  }>`;

  return new PickAsserter(typeName, asserter, keys);
}

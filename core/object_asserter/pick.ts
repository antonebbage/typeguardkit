// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { ObjectAsserter } from "./object_asserter.ts";

/**
 * `pick` returns an `ObjectAsserter<Pick<Type, Keys[number]>>`, created using
 * the provided `ObjectAsserter<Type>` and `Keys`.
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
  assertedTypeName?: string,
): ObjectAsserter<Pick<PropertyAsserters, Keys[number]>> {
  assertedTypeName ||= `Pick<${asserter.typeName}, ${
    keys.map((key) => `"${String(key)}"`).join(" | ")
  }>`;

  const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

  for (const key of keys as string[]) {
    newPropertyAsserters[key] = asserter.propertyAsserters[key];
  }

  return new ObjectAsserter(
    assertedTypeName,
    newPropertyAsserters,
  ) as ObjectAsserter<Pick<PropertyAsserters, Keys[number]>>;
}

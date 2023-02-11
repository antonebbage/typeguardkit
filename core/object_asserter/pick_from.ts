// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { ObjectAsserter, objectAsserter } from "./object_asserter.ts";

/**
 * `pickFrom` returns an `ObjectAsserter<Pick<Type, Keys[number]>>`, created
 * using the provided `ObjectAsserter<Type>` and `Keys`.
 *
 * Example:
 *
 * ```ts
 * import {
 *   _string,
 *   ObjectAsserter,
 *   objectAsserter,
 *   pickFrom,
 * } from "../../mod.ts";
 *
 * // types/user.ts
 *
 * const userAsserter = objectAsserter("User", {
 *   id: _string,
 *   firstName: _string,
 *   lastName: _string,
 * });
 *
 * export type User = ReturnType<typeof userAsserter>;
 *
 * export const _User: ObjectAsserter<User> = userAsserter;
 *
 * // types/user_name.ts
 *
 * const userNameAsserter = pickFrom(_User, ["firstName", "lastName"]);
 *
 * export type UserName = ReturnType<typeof userNameAsserter>;
 *
 * export const _UserName: ObjectAsserter<UserName> = userNameAsserter;
 * ```
 */
export function pickFrom<
  Type extends Record<string, unknown>,
  Keys extends Array<keyof Type>,
>(
  asserter: ObjectAsserter<Type>,
  keys: Keys,
  assertedTypeName?: string,
): ObjectAsserter<Pick<Type, Keys[number]>> {
  assertedTypeName ||= `Pick<${asserter.assertedTypeName}, ${
    keys.map((key) => `"${String(key)}"`).join(" | ")
  }>`;

  const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

  for (const key of keys as string[]) {
    newPropertyAsserters[key] = asserter.propertyAsserters[key];
  }

  return objectAsserter(
    assertedTypeName,
    newPropertyAsserters,
  ) as ObjectAsserter<Pick<Type, Keys[number]>>;
}

// This module is browser-compatible.

import { ArrayAsserter } from "./array_asserter.ts";
import { Asserter } from "./asserter.ts";

/**
 * `arrayOf` can be used to create an `ArrayAsserter` without specifying a
 * `typeName` or `ArrayAsserterOptions`.
 *
 * Example:
 *
 * ```ts
 * import { _string, arrayOf } from "../mod.ts";
 *
 * export const _ArrayOfString = arrayOf(_string);
 *
 * export type ArrayOfString = ReturnType<typeof _ArrayOfString.assert>;
 * ```
 */
export function arrayOf<Element>(
  elementAsserter: Asserter<Element>,
): ArrayAsserter<Element> {
  return new ArrayAsserter(
    `Array<${elementAsserter.typeName}>`,
    elementAsserter,
    {},
  );
}

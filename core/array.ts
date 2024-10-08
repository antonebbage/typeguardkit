// This module is browser-compatible.

import { ArrayAsserter } from "./array_asserter.ts";
import { Asserter } from "./asserter.ts";

/**
 * `array` can be used to create an `ArrayAsserter` without specifying a
 * `typeName` or `ArrayAsserterOptions`.
 *
 * Example:
 *
 * ```ts
 * import { _string, array, Asserted } from "typeguardkit";
 *
 * export const _ArrayOfString = array(_string);
 *
 * export type ArrayOfString = Asserted<typeof _ArrayOfString>;
 * ```
 */
export function array<ElementAsserter extends Asserter<unknown>>(
  elementAsserter: ElementAsserter,
): ArrayAsserter<ElementAsserter> {
  return new ArrayAsserter(
    `Array<${elementAsserter.typeName}>`,
    elementAsserter,
    {},
  );
}

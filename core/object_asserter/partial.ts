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
 * export const _Options = partial(
 *   new ObjectAsserter("", {
 *     option1: _string,
 *     option2: _string,
 *     option3: _string,
 *   }),
 * );
 *
 * export type Options = ReturnType<typeof _Options.assert>;
 * ```
 */
export function partial<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
>(
  asserter: ObjectAsserter<PropertyAsserters>,
): PartialAsserter<PropertyAsserters> {
  return new PartialAsserter(`Partial<${asserter.typeName}>`, asserter);
}

// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { _undefined } from "../undefined.ts";
import { unionOf } from "../union_of.ts";
import { ObjectAsserter, objectAsserter } from "./object_asserter.ts";

/**
 * `partialFrom` returns an `ObjectAsserter<Partial<Type>>`, created using the
 * provided `ObjectAsserter<Type>`.
 *
 * Example:
 *
 * ```ts
 * import {
 *   _string,
 *   ObjectAsserter,
 *   objectAsserter,
 *   partialFrom,
 * } from "../../mod.ts";
 *
 * const asserter = partialFrom(
 *   objectAsserter("", {
 *     option1: _string,
 *     option2: _string,
 *     option3: _string,
 *   }),
 *   "Options",
 * );
 *
 * export type Options = ReturnType<typeof asserter>;
 *
 * export const _Options: ObjectAsserter<Options> = asserter;
 * ```
 */
export function partialFrom<Type extends Record<string, unknown>>(
  asserter: ObjectAsserter<Type>,
  typeName?: string,
): ObjectAsserter<Partial<Type>> {
  typeName ||= `Partial<${asserter.typeName}>`;

  const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

  for (const key in asserter.propertyAsserters) {
    newPropertyAsserters[key] = unionOf([
      asserter.propertyAsserters[key],
      _undefined,
    ]);
  }

  return objectAsserter(typeName, newPropertyAsserters) as ObjectAsserter<
    Partial<Type>
  >;
}

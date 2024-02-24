// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { OptionAsserter } from "../option_asserter.ts";
import { ObjectAsserter } from "./object_asserter.ts";

/**
 * `partial` returns an `ObjectAsserter<Partial<Type>>`, created using the
 * provided `ObjectAsserter<Type>`.
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
 *   "Options",
 * );
 *
 * export type Options = ReturnType<typeof _Options.assert>;
 * ```
 */
export function partial<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
>(
  asserter: ObjectAsserter<PropertyAsserters>,
  assertedTypeName?: string,
): ObjectAsserter<PartialPropertyAsserters<PropertyAsserters>> {
  assertedTypeName ||= `Partial<${asserter.typeName}>`;

  const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

  for (const key in asserter.propertyAsserters) {
    const oldPropertyAsserter = asserter.propertyAsserters[key];

    newPropertyAsserters[key] = oldPropertyAsserter instanceof OptionAsserter
      ? oldPropertyAsserter
      : new OptionAsserter(oldPropertyAsserter);
  }

  return new ObjectAsserter(
    assertedTypeName,
    newPropertyAsserters,
  ) as ObjectAsserter<PartialPropertyAsserters<PropertyAsserters>>;
}

type PartialPropertyAsserters<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
> = {
  [Key in keyof PropertyAsserters]: PropertyAsserters[Key] extends
    OptionAsserter<unknown> ? PropertyAsserters[Key]
    : OptionAsserter<ReturnType<PropertyAsserters[Key]["assert"]>>;
};

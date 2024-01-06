// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export const literalUnionAsserterTypeName = "LiteralUnionAsserter" as const;

/** A `LiteralUnionAsserter` is an `Asserter` for the union of its `values`. */
export interface LiteralUnionAsserter<
  Values extends ReadonlyArray<number | string>,
> extends Asserter<Values[number]> {
  readonly asserterTypeName: typeof literalUnionAsserterTypeName;

  readonly values: Values;
}

/**
 * `literalUnionAsserter` returns a `LiteralUnionAsserter` for the union of the
 * provided `values`.
 *
 * The `values` array should be asserted `as const` if defined outside the
 * `literalUnionAsserter` call.
 *
 * The provided `values` will be set to the `values` property of the returned
 * `LiteralUnionAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { LiteralUnionAsserter, literalUnionAsserter } from "../mod.ts";
 *
 * const asserter = literalUnionAsserter(
 *   "Direction",
 *   ["up", "right", "down", "left"],
 * );
 *
 * export type Direction = ReturnType<typeof asserter>;
 *
 * export const _Direction: LiteralUnionAsserter<readonly Direction[]> =
 *   asserter;
 * ```
 */
export function literalUnionAsserter<
  const Values extends ReadonlyArray<number | string>,
>(
  assertedTypeName: string,
  values: Values,
): LiteralUnionAsserter<Values> {
  assertedTypeName ||= "UnnamedLiteralUnion";

  const asserter = (value: unknown, valueName?: string) => {
    for (const literal of values) {
      if (literal === value) {
        return value;
      }
    }

    throw new TypeAssertionError(assertedTypeName, value, { valueName });
  };

  asserter.asserterTypeName = literalUnionAsserterTypeName;
  asserter.assertedTypeName = assertedTypeName;

  asserter.values = values;

  return asserter as LiteralUnionAsserter<Values>;
}

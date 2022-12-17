// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export interface LiteralUnionAsserter<
  Values extends ReadonlyArray<number | string>,
> extends Asserter<Values[number]> {
  readonly values: Values;
}

/**
 * `literalUnionAsserter` returns a `LiteralUnionAsserter` for the union of the
 * provided `values`.
 *
 * The provided `values` will be set to the `values` property of the returned
 * `LiteralUnionAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { Asserter, literalUnionAsserter } from "../mod.ts";
 *
 * const asserter = literalUnionAsserter(
 *   "Direction",
 *   ["up", "right", "down", "left"] as const,
 * );
 *
 * export type Direction = ReturnType<typeof asserter>;
 *
 * export const _Direction: Asserter<Direction> = asserter;
 * ```
 */
export function literalUnionAsserter<
  Values extends ReadonlyArray<number | string>,
>(
  typeName: string,
  values: Values,
): LiteralUnionAsserter<Values> {
  typeName ||= "UnnamedLiteralUnion";

  const asserter = (value: unknown, valueName?: string) => {
    for (const literal of values) {
      if (literal === value) {
        return value;
      }
    }
    throw new TypeAssertionError(typeName, value, { valueName });
  };

  asserter.typeName = typeName;
  asserter.values = values;

  return asserter as LiteralUnionAsserter<Values>;
}

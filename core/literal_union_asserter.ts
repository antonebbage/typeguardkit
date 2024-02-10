// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * A `LiteralUnionAsserter` is an `Asserter` for the union of its `values`.
 *
 * The provided `values` are made accessible as a property of the created
 * `LiteralUnionAsserter`.
 *
 * The `values` array should be asserted `as const` if defined outside the
 * constructor call.
 *
 * Example:
 *
 * ```ts
 * import { LiteralUnionAsserter } from "../mod.ts";
 *
 * export const _Direction = new LiteralUnionAsserter(
 *   "Direction",
 *   ["up", "right", "down", "left"],
 * );
 *
 * export type Direction = ReturnType<typeof _Direction.assert>;
 * ```
 */
export class LiteralUnionAsserter<
  const Values extends ReadonlyArray<number | string>,
> implements Asserter<Values[number]> {
  readonly typeName: string;

  constructor(
    typeName: string,
    readonly values: Values,
  ) {
    this.typeName = typeName || "UnnamedLiteralUnion";
  }

  assert(value: unknown, valueName?: string): Values[number] {
    for (const literal of this.values) {
      if (literal === value) {
        return value as Values[number];
      }
    }

    throw new TypeAssertionError(this.typeName, value, { valueName });
  }
}

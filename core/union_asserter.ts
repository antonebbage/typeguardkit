// This module is browser-compatible.

import { Asserted } from "./asserted.ts";
import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * A `UnionAsserter` is an `Asserter` for the union of the `Type`s of its
 * `memberAsserters`.
 *
 * The provided `memberAsserters` are made accessible as a property of the
 * created `UnionAsserter`.
 *
 * The `union` function can be used to create a `UnionAsserter` without
 * specifying a `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _null, _string, Asserted, UnionAsserter } from "typeguardkit";
 *
 * export const _stringOrNull = new UnionAsserter(
 *   "stringOrNull",
 *   [_string, _null],
 * );
 *
 * export type stringOrNull = Asserted<typeof _stringOrNull>;
 * ```
 */
export class UnionAsserter<
  Asserters extends ReadonlyArray<Asserter<unknown>>,
> implements Asserter<Asserted<Asserters[number]>> {
  readonly typeName: string;

  constructor(
    typeName: string,
    readonly memberAsserters: Asserters,
  ) {
    this.typeName = typeName || "UnnamedUnion";
  }

  assert(
    value: unknown,
    valueName?: string,
  ): Asserted<Asserters[number]> {
    for (const asserter of this.memberAsserters) {
      try {
        asserter.assert(value);
      } catch {
        continue;
      }

      return value as Asserted<Asserters[number]>;
    }

    throw new TypeAssertionError(this.typeName, value, { valueName });
  }
}

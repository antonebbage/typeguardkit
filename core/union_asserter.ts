// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * A `UnionAsserter` is an `Asserter` for the union of the `Type`s of its
 * `memberAsserters`.
 *
 * The provided `memberAsserters` are made accessible as a property of the
 * created `UnionAsserter`.
 *
 * The `unionOf` function can be used to create a `UnionAsserter` without
 * specifying a `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _null, _string, UnionAsserter } from "../mod.ts";
 *
 * export const _stringOrNull = new UnionAsserter(
 *   "stringOrNull",
 *   [_string, _null],
 * );
 * ```
 */
export class UnionAsserter<
  Asserters extends ReadonlyArray<Asserter<unknown>>,
> implements Asserter<ReturnType<Asserters[number]["assert"]>> {
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
  ): ReturnType<Asserters[number]["assert"]> {
    for (const asserter of this.memberAsserters) {
      try {
        asserter.assert(value);
      } catch {
        continue;
      }

      return value as ReturnType<Asserters[number]["assert"]>;
    }

    throw new TypeAssertionError(this.typeName, value, { valueName });
  }
}

// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export const unionAsserterTypeName = "UnionAsserter" as const;

/**
 * A `UnionAsserter` is an `Asserter` for the union of the `Type`s of its
 * `memberAsserters`.
 */
export interface UnionAsserter<
  Asserters extends ReadonlyArray<Asserter<unknown>>,
> extends Asserter<ReturnType<Asserters[number]>> {
  readonly asserterTypeName: typeof unionAsserterTypeName;

  readonly memberAsserters: Asserters;
}

/**
 * `unionOf` returns a `TypeAsserter` for the union of the `Type`s of the
 * provided `Asserter`s.
 *
 * Example:
 *
 * ```ts
 * import { _null, _string, unionOf } from "../mod.ts";
 *
 * const _stringOrNull = unionOf([_string, _null]);
 * ```
 */
export function unionOf<Asserters extends ReadonlyArray<Asserter<unknown>>>(
  memberAsserters: Asserters,
  assertedTypeName?: string,
): UnionAsserter<Asserters> {
  const definedAssertedTypeName = assertedTypeName ||
    memberAsserters.map((asserter) => asserter.assertedTypeName)
      .join(" | ");

  const asserter = (value: unknown, valueName?: string) => {
    for (const memberAsserter of memberAsserters) {
      try {
        memberAsserter(value);
      } catch {
        continue;
      }

      return value;
    }

    throw new TypeAssertionError(definedAssertedTypeName, value, { valueName });
  };

  asserter.asserterTypeName = unionAsserterTypeName;
  asserter.assertedTypeName = definedAssertedTypeName;

  asserter.memberAsserters = memberAsserters;

  return asserter as UnionAsserter<Asserters>;
}

// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAsserter, typeAsserter } from "./type_asserter.ts";

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
export function unionOf<Asserters extends Array<Asserter<unknown>>>(
  asserters: Asserters,
  assertedTypeName?: string,
): TypeAsserter<ReturnType<Asserters[number]>> {
  assertedTypeName ||= asserters.map((asserter) => asserter.assertedTypeName)
    .join(" | ");

  return typeAsserter(
    assertedTypeName,
    (value): value is ReturnType<Asserters[number]> => {
      for (const asserter of asserters) {
        try {
          asserter(value);
        } catch {
          continue;
        }

        return true;
      }

      return false;
    },
  );
}

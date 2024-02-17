// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { UnionAsserter } from "./union_asserter.ts";

/**
 * `unionOf` can be used to create a `UnionAsserter` without specifying a
 * `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _null, _string, unionOf } from "../mod.ts";
 *
 * export const _stringOrNull = unionOf(_string, _null);
 *
 * export type stringOrNull = ReturnType<typeof _stringOrNull.assert>;
 * ```
 */
export function unionOf<Asserters extends ReadonlyArray<Asserter<unknown>>>(
  ...memberAsserters: Asserters
): UnionAsserter<Asserters> {
  const typeName = memberAsserters.map(({ typeName }) => typeName).join(" | ");

  return new UnionAsserter(typeName, memberAsserters);
}

// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { UnionAsserter } from "./union_asserter.ts";

/**
 * `union` can be used to create a `UnionAsserter` without specifying a
 * `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _null, _string, Asserted, union } from "typeguardkit";
 *
 * export const _stringOrNull = union(_string, _null);
 *
 * export type stringOrNull = Asserted<typeof _stringOrNull>;
 * ```
 */
export function union<Asserters extends ReadonlyArray<Asserter<unknown>>>(
  ...memberAsserters: Asserters
): UnionAsserter<Asserters> {
  const typeName = memberAsserters.map(({ typeName }) => typeName).join(" | ");

  return new UnionAsserter(typeName, memberAsserters);
}

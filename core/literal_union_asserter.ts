// This module is browser-compatible.

import { Asserter, typeAsserter } from "./asserter.ts";

/**
 * `literalUnionAsserter` returns an `Asserter` for the union of the provided
 * `literals`.
 *
 * Example:
 *
 * ```ts
 * import { Asserter, literalUnionAsserter } from "../mod.ts";
 *
 * export const directions = ["up", "right", "down", "left"] as const;
 *
 * const asserter = literalUnionAsserter("Direction", directions);
 *
 * export type Direction = typeof directions[number];
 *
 * export const _Direction: Asserter<Direction> = asserter;
 * ```
 */
export function literalUnionAsserter<
  Literals extends ReadonlyArray<number | string>,
>(
  typeName: string,
  literals: Literals,
): Asserter<Literals[number]> {
  return typeAsserter(
    typeName || "UnnamedLiteralUnion",
    (value): value is Literals[number] => {
      for (const literal of literals) {
        if (literal === value) {
          return true;
        }
      }
      return false;
    },
  );
}

// This module is browser-compatible.

import { Asserter, typeAsserter } from "./asserter.ts";

/**
 * `enumAsserter` returns an `Asserter` for the union of the member types of the
 * provided `enumObject`.
 *
 * Example:
 *
 * ```ts
 * import { enumAsserter } from "../mod.ts";
 *
 * export enum Direction {
 *   Up,
 *   Right,
 *   Down,
 *   Left,
 * }
 *
 * export const _Direction = enumAsserter("Direction", Direction);
 * ```
 */
export function enumAsserter<
  Enum extends Record<string, number | string>,
>(assertedTypeName: string, enumObject: Enum): Asserter<Enum[keyof Enum]> {
  const nonNumericStringKeys = Object.keys(enumObject).filter((key) =>
    isNaN(Number(key))
  );

  return typeAsserter(
    assertedTypeName || "UnnamedEnum",
    (value): value is Enum[keyof Enum] => {
      for (const key of nonNumericStringKeys) {
        if (enumObject[key] === value) {
          return true;
        }
      }
      return false;
    },
  );
}

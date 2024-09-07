// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * An `EnumAsserter` is an `Asserter` for the union of the member types of the
 * provided `enumObject`.
 *
 * The provided `enumObject` is made accessible as a property of the created
 * `EnumAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { EnumAsserter } from "typeguardkit";
 *
 * export enum Direction {
 *   Up,
 *   Right,
 *   Down,
 *   Left,
 * }
 *
 * export const _Direction = new EnumAsserter("Direction", Direction);
 * ```
 */
export class EnumAsserter<
  Enum extends Record<string, number | string>,
> implements Asserter<Enum[keyof Enum]> {
  readonly typeName: string;

  readonly #nonNumericStringKeys: string[];

  constructor(typeName: string, readonly enumObject: Enum) {
    this.typeName = typeName || "UnnamedEnum";

    this.#nonNumericStringKeys = Object.keys(this.enumObject).filter((key) =>
      isNaN(Number(key))
    );
  }

  assert(value: unknown, valueName?: string): Enum[keyof Enum] {
    for (const key of this.#nonNumericStringKeys) {
      if (this.enumObject[key] === value) {
        return value as Enum[keyof Enum];
      }
    }

    throw new TypeAssertionError(this.typeName, value, { valueName });
  }
}

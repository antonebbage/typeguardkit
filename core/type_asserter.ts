// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * A `TypeAsserter<Type>` is an `Asserter<Type>` that uses `typeGuard` to assert
 * whether `value` is of `Type`.
 *
 * Example:
 *
 * ```ts
 * import { TypeAsserter } from "typeguardkit";
 *
 * export const _string = new TypeAsserter(
 *   "string",
 *   (value): value is string => typeof value === "string",
 * );
 * ```
 */
export class TypeAsserter<Type> implements Asserter<Type> {
  readonly typeName: string;

  readonly #typeGuard: (value: unknown) => value is Type;

  constructor(
    typeName: string,
    typeGuard: (value: unknown) => value is Type,
  ) {
    this.typeName = typeName || "UnnamedType";

    this.#typeGuard = typeGuard;
  }

  assert(value: unknown, valueName?: string): Type {
    if (this.#typeGuard(value)) {
      return value;
    }

    throw new TypeAssertionError(this.typeName, value, { valueName });
  }
}

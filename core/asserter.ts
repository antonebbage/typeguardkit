// This module is browser-compatible.

import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * An `Asserter` is a type assertion function. If `value` is of `Type`, the
 * `Asserter` should return `value` as `Type`. Otherwise, the `Asserter` should
 * throw a `TypeAssertionError`, including `valueName` in its `message`.
 */
export interface Asserter<Type> {
  (value: unknown, valueName?: string): Type;
  readonly typeName: string;
}

/**
 * `typeAsserter` returns an `Asserter<Type>` that uses `typeGuard` to assert
 * whether `value` is of `Type`.
 *
 * Example:
 *
 * ```ts
 * import { typeAsserter } from "../mod.ts";
 *
 * export const _string = typeAsserter(
 *   "string",
 *   (value): value is string => typeof value === "string",
 * );
 * ```
 */
export function typeAsserter<Type>(
  typeName: string,
  typeGuard: (value: unknown) => value is Type,
): Asserter<Type> {
  typeName ||= "UnnamedType";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeGuard(value)) {
      return value;
    }
    throw new TypeAssertionError(typeName, value, { valueName });
  };

  asserter.typeName = typeName;

  return asserter;
}

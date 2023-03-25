// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export const typeAsserterTypeName = "TypeAsserter" as const;

/**
 * A `TypeAsserter<Type>` is an `Asserter<Type>` with an `asserterTypeName` of
 * literal type `"TypeAsserter"`.
 */
export interface TypeAsserter<Type> extends Asserter<Type> {
  readonly asserterTypeName: typeof typeAsserterTypeName;
}

/**
 * `typeAsserter` returns a `TypeAsserter<Type>` that uses `typeGuard` to assert
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
  assertedTypeName: string,
  typeGuard: (value: unknown) => value is Type,
): TypeAsserter<Type> {
  assertedTypeName ||= "UnnamedType";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeGuard(value)) {
      return value;
    }

    throw new TypeAssertionError(assertedTypeName, value, { valueName });
  };

  asserter.asserterTypeName = typeAsserterTypeName;
  asserter.assertedTypeName = assertedTypeName;

  return asserter;
}

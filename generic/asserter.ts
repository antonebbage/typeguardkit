// This module is browser-compatible.

import { TypeAssertionError } from '../specific/type_assertion_error.ts';

/** An `Asserter` is a type assertion function. If `value` is of `Type`, the
 * `Asserter` should return `value` as `Type`. Otherwise, the `Asserter` should
 * throw a `TypeAssertionError`. */
export interface Asserter<Type> {
  (value: unknown, name?: string): Type;
  readonly typeName: string;
}

/** `type` returns an `Asserter<Type>` that uses `guard` to assert whether
 * `value` is of `Type`. */
export function type<Type>(
  name: string,
  guard: (value: unknown) => value is Type,
): Asserter<Type> {
  const typeName = name;

  const asserter = (value: unknown, valueName?: string) => {
    if (guard(value)) {
      return value;
    }
    throw new TypeAssertionError(typeName, value, { valueName });
  };

  asserter.typeName = typeName;

  return asserter;
}

/** `undefinedOr` returns an `Asserter<Type | undefined>`, created using the
 * provided `Asserter<Type>`. */
export function undefinedOr<Type>(
  asserter: Asserter<Type>,
): Asserter<Type | undefined> {
  const newTypeName = `${asserter.typeName} | undefined`;

  const newAsserter = (value: unknown, valueName?: string) => {
    if (value === undefined) {
      return value;
    }

    try {
      return asserter(value, valueName);
    } catch {
      throw new TypeAssertionError(newTypeName, value, { valueName });
    }
  };

  newAsserter.typeName = newTypeName;

  return newAsserter;
}

/** `nullOr` returns an `Asserter<Type | null>`, created using the provided
 * `Asserter<Type>`. */
export function nullOr<Type>(asserter: Asserter<Type>): Asserter<Type | null> {
  const newTypeName = `${asserter.typeName} | null`;

  const newAsserter = (value: unknown, valueName?: string) => {
    if (value === null) {
      return value;
    }

    try {
      return asserter(value, valueName);
    } catch {
      throw new TypeAssertionError(newTypeName, value, { valueName });
    }
  };

  newAsserter.typeName = newTypeName;

  return newAsserter;
}

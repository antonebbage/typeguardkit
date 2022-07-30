// This module is browser-compatible.

import { TypeAssertionError } from "../specific/type_assertion_error.ts";

/**
 * An `Asserter` is a type assertion function. If `value` is of `Type`, the
 * `Asserter` should return `value` as `Type`. Otherwise, the `Asserter` should
 * throw a `TypeAssertionError`.
 */
export interface Asserter<Type> {
  (value: unknown, name?: string): Type;
  readonly typeName: string;
}

/**
 * `typeAsserter` returns an `Asserter<Type>` that uses `typeGuard` to assert
 * whether `value` is of `Type`.
 */
export function typeAsserter<Type>(
  typeName: string,
  typeGuard: (value: unknown) => value is Type,
): Asserter<Type> {
  const asserter = (value: unknown, valueName?: string) => {
    if (typeGuard(value)) {
      return value;
    }
    throw new TypeAssertionError(typeName, value, { valueName });
  };

  asserter.typeName = typeName || "UnnamedType";

  return asserter;
}

/**
 * `enumAsserter` returns an `Asserter` for the union of the member types of the
 * provided `enumObject`.
 */
export function enumAsserter<
  Enum extends Record<string, number | string>,
>(typeName: string, enumObject: Enum): Asserter<Enum[keyof Enum]> {
  const nonNumericStringKeys = Object.keys(enumObject).filter((key) =>
    isNaN(Number(key))
  );

  return typeAsserter(
    typeName || "UnnamedEnum",
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

/**
 * `literalUnionAsserter` returns an `Asserter` for the union of the provided
 * `literals`.
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

/**
 * `unionOf` returns an `Asserter` for the union of the `Type`s of the provided
 * `Asserter`s.
 */
export function unionOf<Asserters extends Array<Asserter<unknown>>>(
  asserters: Asserters,
  typeName?: string,
): Asserter<ReturnType<Asserters[number]>> {
  const newTypeName = typeName ||
    asserters.map((asserter) => asserter.typeName).join(" | ");

  return typeAsserter(
    newTypeName,
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

/**
 * `arrayOf` returns an `Asserter<Array<Type>>`, created using the provided
 * `Asserter<Type>`.
 */
export function arrayOf<Type>(
  asserter: Asserter<Type>,
  typeName?: string,
): Asserter<Array<Type>> {
  const newTypeName = typeName || `Array<${asserter.typeName}>`;

  const newAsserter = (value: unknown, valueName?: string) => {
    if (!Array.isArray(value)) {
      throw new TypeAssertionError(newTypeName, value, { valueName });
    }

    for (let i = 0; i < value.length; i++) {
      try {
        asserter(value[i], `[${i}]`);
      } catch (innerError) {
        throw new TypeAssertionError(newTypeName, value, {
          valueName,
          innerError,
        });
      }
    }

    return value;
  };

  newAsserter.typeName = newTypeName;

  return newAsserter;
}

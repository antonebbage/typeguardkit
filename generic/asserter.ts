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

/**
 * `unionOf` returns an `Asserter` for the union of the `Type`s of the provided
 * `Asserter`s.
 *
 * Example:
 *
 * ```ts
 * import { _null, _string, unionOf } from "../mod.ts";
 *
 * const _stringOrNull = unionOf([_string, _null]);
 * ```
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
 *
 * Example:
 *
 * ```ts
 * import { _string, arrayOf } from "../mod.ts";
 *
 * const _arrayOfString = arrayOf(_string);
 * ```
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

    const issues: TypeAssertionError[] = [];

    for (let i = 0; i < value.length; i++) {
      try {
        asserter(value[i], `[${i}]`);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(newTypeName, value, { valueName, issues });
    }

    return value;
  };

  newAsserter.typeName = newTypeName;

  return newAsserter;
}

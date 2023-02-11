// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * `arrayOf` returns an `Asserter<Array<Type>>`, created using the provided
 * `Asserter<Type>`.
 *
 * Example:
 *
 * ```ts
 * import { _string, arrayOf } from "../mod.ts";
 *
 * const _ArrayOfString = arrayOf(_string);
 * ```
 */
export function arrayOf<Type>(
  elementAsserter: Asserter<Type>,
  arrayTypeName?: string,
): Asserter<Array<Type>> {
  const definedArrayTypeName = arrayTypeName ||
    `Array<${elementAsserter.assertedTypeName}>`;

  const arrayAsserter = (value: unknown, valueName?: string) => {
    if (!Array.isArray(value)) {
      throw new TypeAssertionError(definedArrayTypeName, value, { valueName });
    }

    const issues: TypeAssertionError[] = [];

    for (let i = 0; i < value.length; i++) {
      try {
        elementAsserter(value[i], `${i}`);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(definedArrayTypeName, value, {
        valueName,
        issues,
      });
    }

    return value;
  };

  arrayAsserter.assertedTypeName = definedArrayTypeName;

  return arrayAsserter;
}

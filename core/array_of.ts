// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAsserter, typeAsserterTypeName } from "./type_asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * `arrayOf` returns a `TypeAsserter<Array<Type>>`, created using the provided
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
): TypeAsserter<Array<Type>> {
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

  arrayAsserter.asserterTypeName = typeAsserterTypeName;
  arrayAsserter.assertedTypeName = definedArrayTypeName;

  return arrayAsserter;
}

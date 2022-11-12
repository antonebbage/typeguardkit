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
        asserter(value[i], `${i}`);
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

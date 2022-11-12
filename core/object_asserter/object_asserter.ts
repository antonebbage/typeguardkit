// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { TypeAssertionError } from "../type_assertion_error.ts";

/**
 * An `ObjectAsserter` is an `Asserter` for the object type defined by its
 * `propertyAsserters`.
 */
export interface ObjectAsserter<Type extends Record<string, unknown>>
  extends Asserter<Type> {
  readonly propertyAsserters: Readonly<
    { [Key in keyof Type]-?: Asserter<Type[Key]> }
  >;
}

/**
 * `objectAsserter` returns an `ObjectAsserter` for the type defined by the
 * provided `typeName` and `propertyAsserters`.
 *
 * Example:
 *
 * ```ts
 * import {
 *   _number,
 *   _string,
 *   ObjectAsserter,
 *   objectAsserter,
 * } from "../../mod.ts";
 *
 * const asserter = objectAsserter("User", {
 *   name: _string,
 *   age: _number,
 * });
 *
 * export type User = ReturnType<typeof asserter>;
 *
 * export const _User: ObjectAsserter<User> = asserter;
 * ```
 */
export function objectAsserter<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
>(
  typeName: string,
  propertyAsserters: PropertyAsserters,
): ObjectAsserter<
  { [Key in keyof PropertyAsserters]: ReturnType<PropertyAsserters[Key]> }
> {
  typeName ||= "UnnamedObject";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "object" || value === null) {
      throw new TypeAssertionError(typeName, value, { valueName });
    }

    const issues: TypeAssertionError[] = [];

    for (const key in propertyAsserters) {
      try {
        const propertyValue = (value as Record<string, unknown>)[key];
        propertyAsserters[key](propertyValue, key);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(typeName, value, { valueName, issues });
    }

    return value;
  };

  asserter.typeName = typeName;
  asserter.propertyAsserters = propertyAsserters as Required<PropertyAsserters>;

  return asserter as ObjectAsserter<
    { [Key in keyof PropertyAsserters]: ReturnType<PropertyAsserters[Key]> }
  >;
}

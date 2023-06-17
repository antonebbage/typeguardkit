// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { OptionAsserter } from "../option_of.ts";
import { TypeAssertionError } from "../type_assertion_error.ts";

export const objectAsserterTypeName = "ObjectAsserter" as const;

/**
 * An `ObjectAsserter` is an `Asserter` for the object type defined by its
 * `propertyAsserters`.
 */
export interface ObjectAsserter<Type extends Record<string, unknown>>
  extends Asserter<Type> {
  readonly asserterTypeName: typeof objectAsserterTypeName;

  readonly propertyAsserters: Readonly<
    { [Key in keyof Type]-?: Asserter<Type[Key]> }
  >;
}

/**
 * `objectAsserter` returns an `ObjectAsserter` for the type defined by the
 * provided `assertedTypeName` and `propertyAsserters`.
 *
 * Example:
 *
 * ```ts
 * import {
 *   _string,
 *   ObjectAsserter,
 *   objectAsserter,
 *   optionOf,
 * } from "../../mod.ts";
 *
 * const asserter = objectAsserter("User", {
 *   name: _string,
 *   emailAddress: optionOf(_string),
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
  assertedTypeName: string,
  propertyAsserters: PropertyAsserters,
): ObjectAsserter<
  & {
    [
      Key in keyof PropertyAsserters as PropertyAsserters[Key] extends
        OptionAsserter<unknown> ? never : Key
    ]: ReturnType<PropertyAsserters[Key]>;
  }
  & {
    [
      Key in keyof PropertyAsserters as PropertyAsserters[Key] extends
        OptionAsserter<unknown> ? Key : never
    ]?: ReturnType<PropertyAsserters[Key]>;
  }
> {
  assertedTypeName ||= "UnnamedObject";

  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "object" || value === null) {
      throw new TypeAssertionError(assertedTypeName, value, { valueName });
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
      throw new TypeAssertionError(assertedTypeName, value, {
        valueName,
        issues,
      });
    }

    return value;
  };

  asserter.asserterTypeName = objectAsserterTypeName;
  asserter.assertedTypeName = assertedTypeName;

  asserter.propertyAsserters = propertyAsserters;

  // deno-lint-ignore no-explicit-any
  return asserter as any;
}

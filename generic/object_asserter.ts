// This module is browser-compatible.

import { TypeAssertionError } from "../specific/type_assertion_error.ts";
import { Asserter } from "./asserter.ts";

/**
 * An `ObjectAsserter` is an `Asserter` for the object type defined by its
 * `propertyAsserters`.
 */
export interface ObjectAsserter<Type extends Record<string, unknown>>
  extends Asserter<Type> {
  readonly propertyAsserters: Readonly<
    { [Key in keyof Type]: Asserter<Type[Key]> }
  >;
}

/**
 * `objectAsserter` returns an `ObjectAsserter` for the type defined by the
 * provided `typeName` and `propertyAsserters`.
 */
export function objectAsserter<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
>(
  typeName: string,
  propertyAsserters: PropertyAsserters,
): ObjectAsserter<
  { [Key in keyof PropertyAsserters]: ReturnType<PropertyAsserters[Key]> }
> {
  const asserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "object" || value === null) {
      throw new TypeAssertionError(typeName, value, { valueName });
    }

    for (const key in propertyAsserters) {
      try {
        const propertyValue = (value as Record<string, unknown>)[key];
        propertyAsserters[key](propertyValue, `["${key}"]`);
      } catch (innerError) {
        throw new TypeAssertionError(typeName, value, {
          valueName,
          innerError,
        });
      }
    }

    return value;
  };

  asserter.typeName = typeName;
  asserter.propertyAsserters = propertyAsserters;

  return asserter as ObjectAsserter<
    { [Key in keyof PropertyAsserters]: ReturnType<PropertyAsserters[Key]> }
  >;
}

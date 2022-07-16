// This module is browser-compatible.

import { checkTypeNameIsOpen } from "../internal/functions.ts";
import { TypeAssertionError } from "../specific/type_assertion_error.ts";
import { Asserter, typeAsserter } from "./asserter.ts";
import { is } from "./is.ts";

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

/**
 * `objectIntersectionOf` returns an `ObjectAsserter` for the intersection of
 * the `Type`s of the provided `ObjectAsserter`s.
 */
export function objectIntersectionOf<
  TypeA extends Record<string, unknown>,
  TypeB extends Record<string, unknown>,
>(
  asserterA: ObjectAsserter<TypeA>,
  asserterB: ObjectAsserter<TypeB>,
  typeName?: string,
): ObjectAsserter<TypeA & TypeB> {
  const newTypeName = typeName ||
    `${asserterA.typeName} & ${asserterB.typeName}`;

  const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

  for (const key in asserterA.propertyAsserters) {
    const propertyAsserterA = asserterA.propertyAsserters[key];
    const propertyAsserterB = asserterB.propertyAsserters[key];

    if (propertyAsserterB && propertyAsserterB !== propertyAsserterA) {
      const newPropertyTypeName = [
        propertyAsserterA.typeName,
        propertyAsserterB.typeName,
      ].map((name) => {
        return checkTypeNameIsOpen(name) ? `(${name})` : name;
      }).join(" & ");

      newPropertyAsserters[key] = typeAsserter(
        newPropertyTypeName,
        (value): value is unknown => {
          return is(propertyAsserterA, value) && is(propertyAsserterB, value);
        },
      );
    } else {
      newPropertyAsserters[key] = propertyAsserterA;
    }
  }

  for (const key in asserterB.propertyAsserters) {
    if (!asserterA.propertyAsserters[key]) {
      newPropertyAsserters[key] = asserterB.propertyAsserters[key];
    }
  }

  return objectAsserter(newTypeName, newPropertyAsserters) as ObjectAsserter<
    TypeA & TypeB
  >;
}

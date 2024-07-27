// This module is browser-compatible.

import { Asserted } from "../asserted.ts";
import { Asserter } from "../asserter.ts";
import { OptionAsserter } from "../option_asserter.ts";
import { TypeAssertionError } from "../type_assertion_error.ts";
import { SimplifiedTooltipRepresentation } from "./_simplified_tooltip_representation.ts";

/**
 * An `ObjectAsserter` is an `Asserter` for the object type defined by its
 * `propertyAsserters`.
 *
 * The provided `propertyAsserters` are made accessible as a property of the
 * created `ObjectAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { _string, Asserted, ObjectAsserter, option } from "../../mod.ts";
 *
 * export const _User = new ObjectAsserter("User", {
 *   name: _string,
 *   emailAddress: option(_string),
 * });
 *
 * export type User = Asserted<typeof _User>;
 * ```
 */
export class ObjectAsserter<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
> implements Asserter<AssertedObject<PropertyAsserters>> {
  readonly typeName: string;

  constructor(
    typeName: string,
    readonly propertyAsserters: PropertyAsserters,
  ) {
    this.typeName = typeName || "UnnamedObject";
  }

  assert(
    value: unknown,
    valueName?: string,
  ): AssertedObject<PropertyAsserters> {
    if (typeof value !== "object" || value === null) {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    const issues: TypeAssertionError[] = [];

    for (const key in this.propertyAsserters) {
      try {
        const propertyValue = (value as Record<string, unknown>)[key];
        this.propertyAsserters[key].assert(propertyValue, key);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(this.typeName, value, { valueName, issues });
    }

    return value as AssertedObject<PropertyAsserters>;
  }
}

type AssertedObject<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
> = SimplifiedTooltipRepresentation<
  & {
    [
      Key in keyof PropertyAsserters as PropertyAsserters[Key] extends
        OptionAsserter<Asserter<unknown>> ? never : Key
    ]: Asserted<PropertyAsserters[Key]>;
  }
  & {
    [
      Key in keyof PropertyAsserters as PropertyAsserters[Key] extends
        OptionAsserter<Asserter<unknown>> ? Key : never
    ]?: Asserted<PropertyAsserters[Key]>;
  }
>;

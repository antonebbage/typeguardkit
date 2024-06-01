// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { OptionAsserter } from "../option_asserter.ts";
import { SimplifiedTooltipRepresentation } from "./_simplified_tooltip_representation.ts";
import { ObjectAsserter } from "./object_asserter.ts";

/**
 * A `PartialAsserter` is an `ObjectAsserter` for the asserted type of the
 * provided `ObjectAsserter` with all properties set to optional.
 *
 * Example:
 *
 * ```ts
 * import { _string, ObjectAsserter, PartialAsserter } from "../../mod.ts";
 *
 * export const _Options = new PartialAsserter(
 *   "Options",
 *   {
 *     option1: _string,
 *     option2: _string,
 *     option3: _string,
 *   },
 * );
 *
 * export type Options = ReturnType<typeof _Options.assert>;
 * ```
 */
export class PartialAsserter<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
> extends ObjectAsserter<
  SimplifiedTooltipRepresentation<PartialPropertyAsserters<PropertyAsserters>>
> {
  constructor(
    typeName: string,
    asserterOrPropertyAsserters:
      | ObjectAsserter<PropertyAsserters>
      | PropertyAsserters,
  ) {
    const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

    const propertyAsserters =
      asserterOrPropertyAsserters instanceof ObjectAsserter
        ? asserterOrPropertyAsserters.propertyAsserters
        : asserterOrPropertyAsserters;

    for (const key in propertyAsserters) {
      const oldPropertyAsserter = propertyAsserters[key];

      newPropertyAsserters[key] = oldPropertyAsserter instanceof OptionAsserter
        ? oldPropertyAsserter
        : new OptionAsserter(oldPropertyAsserter);
    }

    super(
      typeName || "UnnamedPartial",
      newPropertyAsserters as SimplifiedTooltipRepresentation<
        PartialPropertyAsserters<PropertyAsserters>
      >,
    );
  }
}

type PartialPropertyAsserters<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
> = {
  [Key in keyof PropertyAsserters]: PropertyAsserters[Key] extends
    OptionAsserter<unknown> ? PropertyAsserters[Key]
    : OptionAsserter<ReturnType<PropertyAsserters[Key]["assert"]>>;
};

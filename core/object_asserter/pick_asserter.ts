// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { SimplifiedTooltipRepresentation } from "./_simplified_tooltip_representation.ts";
import { ObjectAsserter } from "./object_asserter.ts";

/**
 * A `PickAsserter` is an `ObjectAsserter` for the type constructed by picking
 * the set of properties `Keys` from the asserted type of the provided
 * `ObjectAsserter`.
 *
 * Example:
 *
 * ```ts
 * import {
 *   _string,
 *   Asserted,
 *   ObjectAsserter,
 *   PickAsserter,
 * } from "../../mod.ts";
 *
 * // types/user.ts
 *
 * export const _User = new ObjectAsserter("User", {
 *   id: _string,
 *   firstName: _string,
 *   lastName: _string,
 * });
 *
 * export type User = Asserted<typeof _User>;
 *
 * // types/user_name.ts
 *
 * export const _UserName = new PickAsserter(
 *   "UserName",
 *   _User,
 *   ["firstName", "lastName"],
 * );
 *
 * export type UserName = Asserted<typeof _UserName>;
 * ```
 */
export class PickAsserter<
  PropertyAsserters extends Record<string, Asserter<unknown>>,
  Keys extends Array<keyof PropertyAsserters>,
> extends ObjectAsserter<
  SimplifiedTooltipRepresentation<Pick<PropertyAsserters, Keys[number]>>
> {
  constructor(
    typeName: string,
    asserter: ObjectAsserter<PropertyAsserters>,
    keys: Keys,
  ) {
    const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

    for (const key of keys as string[]) {
      newPropertyAsserters[key] = asserter.propertyAsserters[key];
    }

    super(
      typeName || "UnnamedPick",
      newPropertyAsserters as SimplifiedTooltipRepresentation<
        Pick<PropertyAsserters, Keys[number]>
      >,
    );
  }
}

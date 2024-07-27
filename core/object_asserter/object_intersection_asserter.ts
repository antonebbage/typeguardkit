// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { is } from "../is.ts";
import { TypeAsserter } from "../type_asserter.ts";
import { isTypeNameOpen } from "./_is_type_name_open.ts";
import { SimplifiedTooltipRepresentation } from "./_simplified_tooltip_representation.ts";
import { ObjectAsserter } from "./object_asserter.ts";

/**
 * An `ObjectIntersectionAsserter` is an `ObjectAsserter` for the intersection
 * of the asserted types of the provided `ObjectAsserter`s.
 *
 * Example:
 *
 * ```ts
 * import {
 *   _string,
 *   Asserted,
 *   ObjectAsserter,
 *   ObjectIntersectionAsserter,
 * } from "../../mod.ts";
 *
 * // types/entity.ts
 *
 * export const _Entity = new ObjectAsserter("Entity", {
 *   id: _string,
 * });
 *
 * export type Entity = Asserted<typeof _Entity>;
 *
 * // types/user.ts
 *
 * export const _User = new ObjectIntersectionAsserter(
 *   "User",
 *   [
 *     _Entity,
 *
 *     {
 *       name: _string,
 *     },
 *   ],
 * );
 *
 * export type User = Asserted<typeof _User>;
 * ```
 */
export class ObjectIntersectionAsserter<
  PropertyAssertersA extends Record<string, Asserter<unknown>>,
  PropertyAssertersB extends Record<string, Asserter<unknown>>,
> extends ObjectAsserter<
  SimplifiedTooltipRepresentation<PropertyAssertersA & PropertyAssertersB>
> {
  constructor(
    typeName: string,
    [asserterA, asserterOrPropertyAssertersB]: [
      ObjectAsserter<PropertyAssertersA>,
      ObjectAsserter<PropertyAssertersB> | PropertyAssertersB,
    ],
  ) {
    const newPropertyAsserters: Record<string, Asserter<unknown>> = {};

    const propertyAssertersB =
      asserterOrPropertyAssertersB instanceof ObjectAsserter
        ? asserterOrPropertyAssertersB.propertyAsserters
        : asserterOrPropertyAssertersB;

    for (const key in asserterA.propertyAsserters) {
      const propertyAsserterA = asserterA.propertyAsserters[key];

      const propertyAsserterB = propertyAssertersB[key] as
        | Asserter<unknown>
        | undefined;

      if (propertyAsserterB && propertyAsserterB !== propertyAsserterA) {
        const newPropertyTypeName = [
          propertyAsserterA.typeName,
          propertyAsserterB.typeName,
        ]
          .map((name) => isTypeNameOpen(name) ? `(${name})` : name)
          .join(" & ");

        newPropertyAsserters[key] = new TypeAsserter(
          newPropertyTypeName,
          (value): value is unknown => {
            return is(propertyAsserterA, value) && is(propertyAsserterB, value);
          },
        );
      } else {
        newPropertyAsserters[key] = propertyAsserterA;
      }
    }

    for (const key in propertyAssertersB) {
      if (!asserterA.propertyAsserters[key]) {
        newPropertyAsserters[key] = propertyAssertersB[key];
      }
    }

    super(
      typeName || "UnnamedObjectIntersection",
      newPropertyAsserters as SimplifiedTooltipRepresentation<
        PropertyAssertersA & PropertyAssertersB
      >,
    );
  }
}

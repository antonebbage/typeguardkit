// This module is browser-compatible.

import { checkTypeNameIsOpen } from "../../internal/mod.ts";
import { Asserter, typeAsserter } from "../asserter.ts";
import { is } from "../is.ts";
import { ObjectAsserter, objectAsserter } from "./object_asserter.ts";

/**
 * `objectIntersectionOf` returns an `ObjectAsserter` for the intersection of
 * the `Type`s of the provided `ObjectAsserter`s.
 *
 * Example:
 *
 * ```ts
 * import {
 *   _string,
 *   ObjectAsserter,
 *   objectAsserter,
 *   objectIntersectionOf,
 * } from "../../mod.ts";
 *
 * // types/entity.ts
 *
 * const entityAsserter = objectAsserter("Entity", {
 *   id: _string,
 * });
 *
 * export type Entity = ReturnType<typeof entityAsserter>;
 *
 * export const _Entity: ObjectAsserter<Entity> = entityAsserter;
 *
 * // types/user.ts
 *
 * const userAsserter = objectIntersectionOf(
 *   _Entity,
 *   objectAsserter("", {
 *     name: _string,
 *   }),
 *   "User",
 * );
 *
 * export type User = ReturnType<typeof userAsserter>;
 *
 * export const _User: ObjectAsserter<User> = userAsserter;
 * ```
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
    const propertyAsserterB = asserterB.propertyAsserters[key] as
      | Asserter<unknown>
      | undefined;

    if (propertyAsserterB && propertyAsserterB !== propertyAsserterA) {
      const newPropertyTypeName = [
        propertyAsserterA.typeName,
        propertyAsserterB.typeName,
      ].map((name) => {
        return checkTypeNameIsOpen(name) ? `(${name})` : name;
      })
        .join(" & ");

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

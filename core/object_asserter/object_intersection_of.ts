// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { is } from "../is.ts";
import { TypeAsserter } from "../type_asserter.ts";
import { isTypeNameOpen } from "./_is_type_name_open.ts";
import { ObjectAsserter } from "./object_asserter.ts";

/**
 * `objectIntersectionOf` returns an `ObjectAsserter` for the intersection of
 * the `Type`s of the provided `ObjectAsserter`s.
 *
 * Example:
 *
 * ```ts
 * import { _string, ObjectAsserter, objectIntersectionOf } from "../../mod.ts";
 *
 * // types/entity.ts
 *
 * const entityAsserter = new ObjectAsserter("Entity", {
 *   id: _string,
 * });
 *
 * export type Entity = ReturnType<typeof entityAsserter.assert>;
 *
 * export const _Entity: ObjectAsserter<Entity> = entityAsserter;
 *
 * // types/user.ts
 *
 * const userAsserter = objectIntersectionOf(
 *   _Entity,
 *   new ObjectAsserter("", {
 *     name: _string,
 *   }),
 *   "User",
 * );
 *
 * export type User = ReturnType<typeof userAsserter.assert>;
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
  assertedTypeName?: string,
): ObjectAsserter<TypeA & TypeB> {
  assertedTypeName ||= `${asserterA.typeName} & ${asserterB.typeName}`;

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

  for (const key in asserterB.propertyAsserters) {
    if (!asserterA.propertyAsserters[key]) {
      newPropertyAsserters[key] = asserterB.propertyAsserters[key];
    }
  }

  return new ObjectAsserter(
    assertedTypeName,
    newPropertyAsserters,
  ) as ObjectAsserter<TypeA & TypeB>;
}

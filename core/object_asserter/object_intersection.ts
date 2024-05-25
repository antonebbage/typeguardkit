// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { ObjectAsserter } from "./object_asserter.ts";
import { ObjectIntersectionAsserter } from "./object_intersection_asserter.ts";

/**
 * `objectIntersection` can be used to create an `ObjectIntersectionAsserter`
 * without specifying a `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, ObjectAsserter, objectIntersection } from "../../mod.ts";
 *
 * // types/a.ts
 *
 * export const _A = new ObjectAsserter("A", {
 *   a: _string,
 * });
 *
 * export type A = ReturnType<typeof _A.assert>;
 *
 * // types/b.ts
 *
 * export const _B = new ObjectAsserter("B", {
 *   b: _string,
 * });
 *
 * export type B = ReturnType<typeof _B.assert>;
 *
 * // types/c.ts
 *
 * export const _C = objectIntersection(_A, _B);
 *
 * export type C = ReturnType<typeof _C.assert>;
 * ```
 */
export function objectIntersection<
  PropertyAssertersA extends Record<string, Asserter<unknown>>,
  PropertyAssertersB extends Record<string, Asserter<unknown>>,
>(
  asserterA: ObjectAsserter<PropertyAssertersA>,
  asserterB: ObjectAsserter<PropertyAssertersB>,
): ObjectIntersectionAsserter<PropertyAssertersA, PropertyAssertersB> {
  return new ObjectIntersectionAsserter(
    `${asserterA.typeName} & ${asserterB.typeName}`,
    [asserterA, asserterB],
  );
}

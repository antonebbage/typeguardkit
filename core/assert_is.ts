// This module is browser-compatible.

import { Asserter } from "./asserter.ts";

/**
 * `assertIs` wraps `asserter` with an assertion signature so `value` can be
 * narrowed to `Type`. If `asserter` throws an error, it will bubble up.
 * Otherwise, `assertIs` will not return a value, but after calling it, `value`
 * will be narrowed to `Type`.
 *
 * Example:
 *
 * ```ts
 * import { _string, assertIs } from "../mod.ts";
 *
 * function handleUnknown(x: unknown) {
 *   try {
 *     assertIs(_string, x, "x");
 *   } catch {
 *     return;
 *   }
 *
 *   handleString(x);
 * }
 *
 * function handleString(x: string) {};
 * ```
 */
export function assertIs<Type>(
  asserter: Asserter<Type>,
  value: unknown,
  name?: string,
): asserts value is Type {
  asserter(value, name);
}

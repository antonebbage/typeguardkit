// This module is browser-compatible.

import { Asserter } from "./asserter.ts";

/**
 * `assertIs` wraps `asserter` with an assertion signature so `value` can be
 * narrowed to `Type`. If `asserter.assert` throws an error, it will bubble up.
 * Otherwise, `assertIs` will not return a value, but after calling it, `value`
 * will be narrowed to `Type`.
 *
 * Example:
 *
 * ```ts
 * import { _string, assertIs } from "typeguardkit";
 *
 * function handleUnknown(x: unknown) {
 *   assertIs(_string, x, "x");
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
  valueName?: string,
): asserts value is Type {
  asserter.assert(value, valueName);
}

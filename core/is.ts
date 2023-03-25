// This module is browser-compatible.

import { Asserter } from "./asserter.ts";

/**
 * `is` wraps `asserter` with a predicate signature, creating a type guard, so
 * that `value` can be narrowed to `Type`. If `asserter` throws an error, `is`
 * will catch it and return `false`. Otherwise, `is` will return `true`.
 *
 * Example:
 *
 * ```ts
 * import { _string, is } from "../mod.ts";
 *
 * function handleUnknown(x: unknown) {
 *   if (is(_string, x)) {
 *     handleString(x);
 *   }
 * }
 *
 * function handleString(x: string) {}
 * ```
 */
export function is<Type>(
  asserter: Asserter<Type>,
  value: unknown,
): value is Type {
  try {
    asserter(value);
  } catch {
    return false;
  }

  return true;
}

// This module is browser-compatible.

import { numberAsserter } from "../core/mod.ts";

/**
 * `_NonNegativeNumber` is a `number` type assertion function that also asserts
 * that `value` is >= 0. If `value` is a `number` >= 0, `_NonNegativeNumber`
 * returns `value` as `number`. Otherwise, `_NonNegativeNumber` throws a
 * `TypeAssertionError`, including `valueName` in its `message`.
 */
export const _NonNegativeNumber = numberAsserter("NonNegativeNumber", {
  disallowNaN: true,
  min: { value: 0, inclusive: true },
});

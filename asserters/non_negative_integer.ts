// This module is browser-compatible.

import { numberAsserter } from "../core/mod.ts";

/**
 * `_NonNegativeInteger` is a `number` type assertion function that also asserts
 * that `value` is a non-negative integer. If `value` is a non-negative integer
 * `number`, `_NonNegativeInteger` returns `value` as `number`. Otherwise,
 * `_NonNegativeInteger` throws a `TypeAssertionError`, including `valueName` in
 * its `message`.
 */
export const _NonNegativeInteger = numberAsserter("NonNegativeInteger", {
  disallowNaN: true,
  min: { value: 0, inclusive: true },
  step: 1,
});

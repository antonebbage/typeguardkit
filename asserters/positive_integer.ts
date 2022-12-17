// This module is browser-compatible.

import { numberAsserter } from "../core/mod.ts";

/**
 * `_PositiveInteger` is a `number` type assertion function that also asserts
 * that `value` is a positive integer. If `value` is a positive integer
 * `number`, `_PositiveInteger` returns `value` as `number`. Otherwise,
 * `_PositiveInteger` throws a `TypeAssertionError`, including `valueName` in
 * its `message`.
 */
export const _PositiveInteger = numberAsserter("PositiveInteger", {
  disallowNaN: true,
  min: { value: 1, inclusive: true },
  step: 1,
});

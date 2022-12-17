// This module is browser-compatible.

import { numberAsserter } from "../core/mod.ts";

/**
 * `_PositiveNumber` is a `number` type assertion function that also asserts
 * that `value` is > 0. If `value` is a `number` > 0, `_PositiveNumber` returns
 * `value` as `number`. Otherwise, `_PositiveNumber` throws a
 * `TypeAssertionError`, including `valueName` in its `message`.
 */
export const _PositiveNumber = numberAsserter("PositiveNumber", {
  disallowNaN: true,
  min: { value: 0, inclusive: false },
});

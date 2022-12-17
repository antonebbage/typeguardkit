// This module is browser-compatible.

import { numberAsserter } from "../core/mod.ts";

/**
 * `_Integer` is a `number` type assertion function that also asserts that
 * `value` is an integer. If `value` is an integer `number`, `_Integer` returns
 * `value` as `number`. Otherwise, `_Integer` throws a `TypeAssertionError`,
 * including `valueName` in its `message`.
 */
export const _Integer = numberAsserter("Integer", {
  disallowNaN: true,
  step: 1,
});

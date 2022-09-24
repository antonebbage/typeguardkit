// This module is browser-compatible.

import { typeAsserter } from "../core/mod.ts";

/**
 * `_number` is a `number` type assertion function. If `value` is a `number`,
 * `_number` returns `value` as `number`. Otherwise, `_number` throws a
 * `TypeAssertionError`, including `name` in its `message`.
 */
export const _number = typeAsserter(
  "number",
  (value): value is number => typeof value === "number",
);

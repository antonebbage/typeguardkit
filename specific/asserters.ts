// This module is browser-compatible.

import { typeAsserter } from "../generic/mod.ts";

/**
 * `_boolean` is a `boolean` type assertion function. If `value` is a `boolean`,
 * `_boolean` returns `value` as `boolean`. Otherwise, `_boolean` throws a
 * `TypeAssertionError`, including `name` in its `message`.
 */
export const _boolean = typeAsserter(
  "boolean",
  (value): value is boolean => typeof value === "boolean",
);

/**
 * `_number` is a `number` type assertion function. If `value` is a `number`,
 * `_number` returns `value` as `number`. Otherwise, `_number` throws a
 * `TypeAssertionError`, including `name` in its `message`.
 */
export const _number = typeAsserter(
  "number",
  (value): value is number => typeof value === "number",
);

/**
 * `_string` is a `string` type assertion function. If `value` is a `string`,
 * `_string` returns `value` as `string`. Otherwise, `_string` throws a
 * `TypeAssertionError`, including `name` in its `message`.
 */
export const _string = typeAsserter(
  "string",
  (value): value is string => typeof value === "string",
);

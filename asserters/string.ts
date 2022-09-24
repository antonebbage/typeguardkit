// This module is browser-compatible.

import { typeAsserter } from "../core/mod.ts";

/**
 * `_string` is a `string` type assertion function. If `value` is a `string`,
 * `_string` returns `value` as `string`. Otherwise, `_string` throws a
 * `TypeAssertionError`, including `name` in its `message`.
 */
export const _string = typeAsserter(
  "string",
  (value): value is string => typeof value === "string",
);

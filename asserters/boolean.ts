// This module is browser-compatible.

import { typeAsserter } from "../core/mod.ts";

/**
 * `_boolean` is a `boolean` type assertion function. If `value` is a `boolean`,
 * `_boolean` returns `value` as `boolean`. Otherwise, `_boolean` throws a
 * `TypeAssertionError`, including `name` in its `message`.
 */
export const _boolean = typeAsserter(
  "boolean",
  (value): value is boolean => typeof value === "boolean",
);

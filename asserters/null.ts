// This module is browser-compatible.

import { typeAsserter } from "../core/mod.ts";

/**
 * `_null` is a `null` type assertion function. If `value` is `null`, `_null`
 * returns `value` as `null`. Otherwise, `_null` throws a `TypeAssertionError`,
 * including `name` in its `message`.
 */
export const _null = typeAsserter(
  "null",
  (value): value is null => value === null,
);

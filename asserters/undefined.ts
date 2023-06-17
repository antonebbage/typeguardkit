// This module is browser-compatible.

import { typeAsserter } from "../core/mod.ts";

/**
 * `_undefined` is an `undefined` type assertion function. If `value` is
 * `undefined`, `_undefined` returns `value` as `undefined`. Otherwise,
 * `_undefined` throws a `TypeAssertionError`, including `valueName` in its
 * `message`.
 */
export const _undefined = typeAsserter(
  "undefined",
  (value): value is undefined => value === undefined,
);

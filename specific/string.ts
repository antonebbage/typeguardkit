// This module is browser-compatible.

import { type } from '../generic/mod.ts';

/** `_string` is a `string` assertion function. If `value` is a `string`,
 * `_string` returns `value` as `string`. Otherwise, `_string` throws a
 * `TypeAssertionError`, including `name` in its `message`. */
export const _string = type(
  'string',
  (value): value is string => typeof value === 'string',
);

// This module is browser-compatible.

import { type } from '../generic/mod.ts';

/** `_boolean` is a `boolean` assertion function. If `value` is a `boolean`,
 * `_boolean` returns `value` as `boolean`. Otherwise, `_boolean` throws a
 * `TypeError`, including `name` in the message. */
export const _boolean = type(
  'boolean',
  (value): value is boolean => typeof value === 'boolean',
);

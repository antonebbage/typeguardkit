// This module is browser-compatible.

import { type } from '../generic/mod.ts';

/** `_number` is a `number` assertion function. If `value` is a `number`,
 * `_number` returns `value` as `number`. Otherwise, `_number` throws a
 * `TypeAssertionError`, including `name` in its `message`. */
export const _number = type(
  'number',
  (value): value is number => typeof value === 'number',
);

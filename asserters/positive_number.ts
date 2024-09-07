// This module is browser-compatible.

import { NumberAsserter } from "../core/mod.ts";

/** `_PositiveNumber` is a positive `NumberAsserter`. */
export const _PositiveNumber = new NumberAsserter("PositiveNumber", {
  canBeNaN: false,
  min: { value: 0, inclusive: false },
});

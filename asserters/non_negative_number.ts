// This module is browser-compatible.

import { NumberAsserter } from "../core/mod.ts";

/** `_NonNegativeNumber` is a non-negative `NumberAsserter`. */
export const _NonNegativeNumber = new NumberAsserter("NonNegativeNumber", {
  canBeNaN: false,
  min: { value: 0, inclusive: true },
});

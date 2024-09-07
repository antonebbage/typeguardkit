// This module is browser-compatible.

import { NumberAsserter } from "../core/mod.ts";

/** `_NonNegativeInteger` is a non-negative integer `NumberAsserter`. */
export const _NonNegativeInteger = new NumberAsserter("NonNegativeInteger", {
  canBeNaN: false,
  min: { value: 0, inclusive: true },
  step: 1,
});

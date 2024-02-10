// This module is browser-compatible.

import { NumberAsserter } from "../core/mod.ts";

/** `_PositiveInteger` is a positive integer `NumberAsserter`. */
export const _PositiveInteger = new NumberAsserter("PositiveInteger", {
  disallowNaN: true,
  min: { value: 1, inclusive: true },
  step: 1,
});

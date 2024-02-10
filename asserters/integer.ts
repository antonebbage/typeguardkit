// This module is browser-compatible.

import { NumberAsserter } from "../core/mod.ts";

/** `_Integer` is an integer `NumberAsserter`. */
export const _Integer = new NumberAsserter("Integer", {
  disallowNaN: true,
  step: 1,
});

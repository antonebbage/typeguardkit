// This module is browser-compatible.

import { TypeAsserter } from "../core/mod.ts";

/** `_number` is a `TypeAsserter<number>`. */
export const _number = new TypeAsserter(
  "number",
  (value): value is number => typeof value === "number",
);

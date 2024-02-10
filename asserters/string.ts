// This module is browser-compatible.

import { TypeAsserter } from "../core/mod.ts";

/** `_string` is a `TypeAsserter<string>`. */
export const _string = new TypeAsserter(
  "string",
  (value): value is string => typeof value === "string",
);

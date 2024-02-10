// This module is browser-compatible.

import { TypeAsserter } from "../core/mod.ts";

/** `_boolean` is a `TypeAsserter<boolean>`. */
export const _boolean = new TypeAsserter(
  "boolean",
  (value): value is boolean => typeof value === "boolean",
);

// This module is browser-compatible.

import { TypeAsserter } from "../core/mod.ts";

/** `_null` is a `TypeAsserter<null>`. */
export const _null = new TypeAsserter(
  "null",
  (value): value is null => value === null,
);

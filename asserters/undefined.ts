// This module is browser-compatible.

import { TypeAsserter } from "../core/mod.ts";

/** `_undefined` is a `TypeAsserter<undefined>`. */
export const _undefined = new TypeAsserter(
  "undefined",
  (value): value is undefined => value === undefined,
);

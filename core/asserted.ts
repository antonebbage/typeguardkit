// This module is browser-compatible.

import { Asserter } from "./asserter.ts";

/**
 * `Asserted` constructs a type consisting of the asserted type of
 * `AsserterImplementation`.
 */
export type Asserted<AsserterImplementation extends Asserter<unknown>> =
  ReturnType<AsserterImplementation["assert"]>;

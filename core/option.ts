// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { OptionAsserter } from "./option_asserter.ts";

/**
 * `option` returns an `OptionAsserter` for the union of the `Type` of the
 * provided `definedTypeAsserter` with `undefined`.
 *
 * Example:
 *
 * ```ts
 * import { _string, option } from "../mod.ts";
 *
 * export const _OptionalString = option(_string);
 * ```
 */
export function option<DefinedTypeAsserter extends Asserter<unknown>>(
  definedTypeAsserter: DefinedTypeAsserter,
): OptionAsserter<DefinedTypeAsserter> {
  return new OptionAsserter(definedTypeAsserter);
}

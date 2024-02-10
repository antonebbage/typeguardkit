// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { OptionAsserter } from "./option_asserter.ts";

/**
 * `optionOf` returns an `OptionAsserter` for the union of the `DefinedType` of
 * the provided `definedTypeAsserter` with `undefined`.
 *
 * Example:
 *
 * ```ts
 * import { _string, optionOf } from "../mod.ts";
 *
 * export const _OptionalString = optionOf(_string);
 * ```
 */
export function optionOf<DefinedType>(
  definedTypeAsserter: Asserter<DefinedType>,
): OptionAsserter<DefinedType> {
  return new OptionAsserter(definedTypeAsserter);
}

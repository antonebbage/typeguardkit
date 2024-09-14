// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { OptionAsserter } from "./option_asserter.ts";

/**
 * `option` can be used to create an `OptionAsserter` without specifying a
 * `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, option } from "typeguardkit";
 *
 * export const _OptionalString = option(_string);
 * ```
 */
export function option<DefinedTypeAsserter extends Asserter<unknown>>(
  definedTypeAsserter: DefinedTypeAsserter,
): OptionAsserter<DefinedTypeAsserter> {
  return new OptionAsserter(
    `${definedTypeAsserter.typeName} | undefined`,
    definedTypeAsserter,
  );
}

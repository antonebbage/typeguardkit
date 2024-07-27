// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { RecordAsserter } from "./record_asserter.ts";

/**
 * `record` can be used to create a `RecordAsserter` without specifying a
 * `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, record } from "../mod.ts";
 *
 * export const _RecordOfStringByString = record(_string, _string);
 *
 * export type RecordOfStringByString = ReturnType<
 *   typeof _RecordOfStringByString.assert
 * >;
 * ```
 */
export function record<
  KeyAsserter extends Asserter<string>,
  ValueAsserter extends Asserter<unknown>,
>(
  keyAsserter: KeyAsserter,
  valueAsserter: ValueAsserter,
): RecordAsserter<KeyAsserter, ValueAsserter> {
  return new RecordAsserter(
    `Record<${keyAsserter.typeName}, ${valueAsserter.typeName}>`,
    [keyAsserter, valueAsserter],
  );
}

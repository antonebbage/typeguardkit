// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { LiteralUnionAsserter } from "./literal_union_asserter.ts";
import { RecordAsserter } from "./record_asserter.ts";
import { TypeAsserter } from "./type_asserter.ts";

/**
 * `recordOf` can be used to create a `RecordAsserter` without specifying a
 * `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, recordOf } from "../mod.ts";
 *
 * export const _RecordOfStringByString = recordOf(_string, _string);
 * ```
 */
export function recordOf<Key extends string, Value>(
  keyAsserter: TypeAsserter<Key> | LiteralUnionAsserter<readonly Key[]>,
  valueAsserter: Asserter<Value>,
): RecordAsserter<Key, Value> {
  return new RecordAsserter(
    `Record<${keyAsserter.typeName}, ${valueAsserter.typeName}>`,
    [keyAsserter, valueAsserter],
  );
}

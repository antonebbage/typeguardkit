// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { LiteralUnionAsserter } from "./literal_union_asserter.ts";
import { TypeAsserter } from "./type_asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 *  A `RecordAsserter` is an `Asserter` for the `Record` type defined by its
 * `keyAsserter` and `valueAsserter`.
 *
 * The provided `keyAsserter` and `valueAsserter` are made accessible as
 * properties of the created `RecordAsserter`.
 *
 * The `recordOf` function can be used to create a `RecordAsserter` without
 * specifying a `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, RecordAsserter } from "../mod.ts";
 *
 * export const _RecordOfStringByString = new RecordAsserter(
 *   "RecordOfStringByString",
 *   [_string, _string],
 * );
 *
 * export type RecordOfStringByString = ReturnType<
 *   typeof _RecordOfStringByString.assert
 * >;
 * ```
 */
export class RecordAsserter<Key extends string, Value>
  implements Asserter<Record<Key, Value>> {
  readonly typeName: string;

  readonly keyAsserter:
    | TypeAsserter<Key>
    | LiteralUnionAsserter<readonly Key[]>;

  readonly valueAsserter: Asserter<Value>;

  constructor(
    typeName: string,
    [keyAsserter, valueAsserter]: [
      keyAsserter:
        | TypeAsserter<Key>
        | LiteralUnionAsserter<readonly Key[]>,

      valueAsserter: Asserter<Value>,
    ],
  ) {
    this.typeName = typeName || "UnnamedRecord";

    this.keyAsserter = keyAsserter;
    this.valueAsserter = valueAsserter;
  }

  assert(value: unknown, valueName?: string): Record<Key, Value> {
    if (typeof value !== "object" || Array.isArray(value) || value === null) {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    const issues: TypeAssertionError[] = [];

    const keys = new Set(Object.keys(value));

    if (this.keyAsserter instanceof LiteralUnionAsserter) {
      for (const key of this.keyAsserter.values) {
        keys.add(key);
      }
    }

    for (const key of keys.values()) {
      try {
        this.keyAsserter.assert(key, `${key} (key)`);
      } catch (error) {
        issues.push(error);
      }

      try {
        this.valueAsserter.assert((value as Record<string, unknown>)[key], key);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(this.typeName, value, { valueName, issues });
    }

    return value as Record<Key, Value>;
  }
}

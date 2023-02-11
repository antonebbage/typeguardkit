// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { LiteralUnionAsserter } from "./literal_union_asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * `recordOf` returns an `Asserter<Record<Key, Value>>`, created using the
 * provided `Asserter<Key>` and `Asserter<Value>`.
 *
 * Example:
 *
 * ```ts
 * import { _string, recordOf } from "../mod.ts";
 *
 * const _RecordOfString = recordOf(_string, _string);
 * ```
 */
export function recordOf<Key extends string, Value>(
  keyAsserter: Asserter<Key>,
  valueAsserter: Asserter<Value>,
  recordTypeName?: string,
): Asserter<Record<Key, Value>> {
  const definedRecordTypeName = recordTypeName ||
    `Record<${keyAsserter.assertedTypeName}, ${valueAsserter.assertedTypeName}>`;

  const recordAsserter = (value: unknown, valueName?: string) => {
    if (typeof value !== "object" || Array.isArray(value) || value === null) {
      throw new TypeAssertionError(definedRecordTypeName, value, { valueName });
    }

    const issues: TypeAssertionError[] = [];

    const keys = new Set(Object.keys(value));

    if ((keyAsserter as LiteralUnionAsserter<Key[]>).values) {
      for (const key of (keyAsserter as LiteralUnionAsserter<Key[]>).values) {
        keys.add(key);
      }
    }

    for (const key of keys.values()) {
      try {
        keyAsserter(key, `${key} (key)`);
      } catch (error) {
        issues.push(error);
      }

      try {
        valueAsserter((value as Record<string, unknown>)[key], key);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(definedRecordTypeName, value, {
        valueName,
        issues,
      });
    }

    return value;
  };

  recordAsserter.assertedTypeName = definedRecordTypeName;

  return recordAsserter as Asserter<Record<Key, Value>>;
}

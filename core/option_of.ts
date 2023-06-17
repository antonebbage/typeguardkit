// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

export const optionAsserterTypeName = "OptionAsserter" as const;

/**
 * An `OptionAsserter` is an `Asserter` for the union of the `DefinedType` of
 * its `definedTypeAsserter` with `undefined`.
 */
export interface OptionAsserter<
  DefinedType,
> extends Asserter<DefinedType | undefined> {
  readonly asserterTypeName: typeof optionAsserterTypeName;

  readonly definedTypeAsserter: Asserter<DefinedType>;
}

/**
 * `optionOf` returns an `OptionAsserter` for the union of the `DefinedType` of
 * the provided `definedTypeAsserter` with `undefined`.
 *
 * Example:
 *
 * ```ts
 * import { _string, optionOf } from "../mod.ts";
 *
 * const _OptionalString = optionOf(_string);
 * ```
 */
export function optionOf<DefinedType>(
  definedTypeAsserter: Asserter<DefinedType>,
): OptionAsserter<DefinedType> {
  const assertedTypeName =
    `${definedTypeAsserter.assertedTypeName} | undefined`;

  const asserter = (value: unknown, valueName?: string) => {
    if (value === undefined) {
      return;
    }

    try {
      definedTypeAsserter(value);
    } catch {
      throw new TypeAssertionError(assertedTypeName, value, { valueName });
    }

    return value;
  };

  asserter.asserterTypeName = optionAsserterTypeName;
  asserter.assertedTypeName = assertedTypeName;

  asserter.definedTypeAsserter = definedTypeAsserter;

  return asserter as OptionAsserter<DefinedType>;
}

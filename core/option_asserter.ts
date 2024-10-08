// This module is browser-compatible.

import { Asserted } from "./asserted.ts";
import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * An `OptionAsserter` is an `Asserter` for the union of the `Type` of its
 * `definedTypeAsserter` with `undefined`, intended to be used with
 * `ObjectAsserter` to assert optional properties.
 *
 * The provided `definedTypeAsserter` is made accessible as a property of the
 * created `OptionAsserter`.
 *
 * The `option` function can be used to create an `OptionAsserter` without
 * specifying a `typeName`.
 *
 * Example:
 *
 * ```ts
 * import { _string, OptionAsserter } from "typeguardkit";
 *
 * export const _OptionalString = new OptionAsserter("OptionalString", _string);
 * ```
 */
export class OptionAsserter<
  DefinedTypeAsserter extends Asserter<unknown>,
> implements Asserter<Asserted<DefinedTypeAsserter> | undefined> {
  readonly typeName: string;

  constructor(
    typeName: string,
    readonly definedTypeAsserter: DefinedTypeAsserter,
  ) {
    this.typeName = typeName || "UnnamedOption";
  }

  assert(
    value: unknown,
    valueName?: string,
  ): Asserted<DefinedTypeAsserter> | undefined {
    if (value === undefined) {
      return;
    }

    try {
      this.definedTypeAsserter.assert(value);
    } catch {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    return value as Asserted<DefinedTypeAsserter>;
  }
}

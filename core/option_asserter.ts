// This module is browser-compatible.

import { Asserter } from "./asserter.ts";
import { TypeAssertionError } from "./type_assertion_error.ts";

/**
 * An `OptionAsserter` is an `Asserter` for the union of the `Type` of its
 * `definedTypeAsserter` with `undefined`.
 *
 * Example:
 *
 * ```ts
 * import { _string, OptionAsserter } from "../mod.ts";
 *
 * export const _OptionalString = new OptionAsserter(_string);
 * ```
 */
export class OptionAsserter<
  DefinedTypeAsserter extends Asserter<unknown>,
> implements Asserter<ReturnType<DefinedTypeAsserter["assert"]> | undefined> {
  readonly typeName: string;

  constructor(
    readonly definedTypeAsserter: DefinedTypeAsserter,
  ) {
    this.typeName = `${definedTypeAsserter.typeName} | undefined`;
  }

  assert(
    value: unknown,
    valueName?: string,
  ): ReturnType<DefinedTypeAsserter["assert"]> | undefined {
    if (value === undefined) {
      return;
    }

    try {
      this.definedTypeAsserter.assert(value);
    } catch {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    return value as ReturnType<DefinedTypeAsserter["assert"]>;
  }
}

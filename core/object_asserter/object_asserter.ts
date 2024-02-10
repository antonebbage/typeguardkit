// This module is browser-compatible.

import { Asserter } from "../asserter.ts";
import { TypeAssertionError } from "../type_assertion_error.ts";

/**
 * An `ObjectAsserter` is an `Asserter` for the object type defined by its
 * `propertyAsserters`.
 *
 * The provided `propertyAsserters` are made accessible as a property of the
 * created `ObjectAsserter`.
 *
 * Example:
 *
 * ```ts
 * import { _string, ObjectAsserter, optionOf } from "../../mod.ts";
 *
 * const asserter = new ObjectAsserter("User", {
 *   name: _string,
 *   emailAddress: optionOf(_string),
 * });
 *
 * export type User = ReturnType<typeof asserter.assert>;
 *
 * export const _User: ObjectAsserter<User> = asserter;
 * ```
 */
export class ObjectAsserter<Type extends Record<string, unknown>>
  implements Asserter<Type> {
  readonly typeName: string;

  constructor(
    typeName: string,
    readonly propertyAsserters: { [Key in keyof Type]-?: Asserter<Type[Key]> },
  ) {
    this.typeName = typeName || "UnnamedObject";
  }

  assert(value: unknown, valueName?: string): Type {
    if (typeof value !== "object" || value === null) {
      throw new TypeAssertionError(this.typeName, value, { valueName });
    }

    const issues: TypeAssertionError[] = [];

    for (const key in this.propertyAsserters) {
      try {
        const propertyValue = (value as Record<string, unknown>)[key];
        this.propertyAsserters[key].assert(propertyValue, key);
      } catch (error) {
        issues.push(error);
      }
    }

    if (issues.length) {
      throw new TypeAssertionError(this.typeName, value, { valueName, issues });
    }

    // deno-lint-ignore no-explicit-any
    return value as any;
  }
}

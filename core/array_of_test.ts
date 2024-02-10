import { assertInstanceOf, assertStrictEquals, assertThrows } from "assert";
import { describe, it } from "testing/bdd.ts";
import {
  _number,
  _string,
  ArrayAsserter,
  ArrayAsserterOptions,
  TypeAssertionError,
} from "../mod.ts";
import { arrayOf } from "./array_of.ts";

describe("arrayOf", () => {
  const _ArrayOfString = arrayOf(_string);
  const _ArrayOfNumber = arrayOf(_number);

  it("should return an `ArrayAsserter`", () => {
    assertInstanceOf(_ArrayOfString, ArrayAsserter);
  });

  it("should return an `ArrayAsserter` with the correct `typeName`", () => {
    const testCases = [
      { asserter: _ArrayOfString, typeName: `Array<${_string.typeName}>` },
      { asserter: _ArrayOfNumber, typeName: `Array<${_number.typeName}>` },
    ];

    for (const { asserter, typeName } of testCases) {
      assertStrictEquals(asserter.typeName, typeName);
    }
  });

  it("should return an `ArrayAsserter` with the provided `elementAsserter` set to its `elementAsserter` property", () => {
    const testCases = [
      { arrayAsserter: _ArrayOfString, elementAsserter: _string },
      { arrayAsserter: _ArrayOfNumber, elementAsserter: _number },
    ];

    for (const { arrayAsserter, elementAsserter } of testCases) {
      assertStrictEquals(arrayAsserter.elementAsserter, elementAsserter);
    }
  });

  it("should return an `ArrayAsserter` with the correct `ArrayAsserterOptions` properties", () => {
    const testCases: Array<
      { asserter: ArrayAsserter<unknown>; options: ArrayAsserterOptions }
    > = [
      { asserter: _ArrayOfString, options: {} },
      { asserter: _ArrayOfNumber, options: {} },
    ];

    for (const { asserter, options } of testCases) {
      assertStrictEquals(asserter.minLength, options.minLength);
      assertStrictEquals(asserter.maxLength, options.maxLength);
    }
  });

  it("should return an `ArrayAsserter` whose `assert` method returns `value` when it is an `Array` where `elementAsserter` does not throw an error for any element", () => {
    const testCases = [
      { asserter: _ArrayOfString, values: [[], [""], ["a", "b", "c"]] },
      { asserter: _ArrayOfNumber, values: [[], [0], [0, 1, 2]] },
    ];

    for (const { asserter, values } of testCases) {
      for (const value of values) {
        assertStrictEquals(asserter.assert(value), value);
      }
    }
  });

  it("should return an `ArrayAsserter` whose `assert` method throws a `TypeAssertionError` with correct `message` when `value` is not an `Array` where `elementAsserter` does not throw an error for any element", () => {
    assertThrows(
      () => _ArrayOfString.assert([undefined, undefined], "name"),
      TypeAssertionError,
      new TypeAssertionError(
        _ArrayOfString.typeName,
        [undefined, undefined],
        {
          valueName: "name",

          issues: [
            new TypeAssertionError(_string.typeName, undefined, {
              valueName: "0",
            }),

            new TypeAssertionError(_string.typeName, undefined, {
              valueName: "1",
            }),
          ],
        },
      )
        .message,
    );

    const testCases: Array<{
      asserter: ArrayAsserter<unknown>;
      values: Array<[value: unknown, issues?: string[]]>;
    }> = [
      {
        asserter: _ArrayOfString,

        values: [
          [undefined],
          [null],
          [false],
          [0],
          [""],
          [{}],

          [[undefined]],
          [[null]],
          [[false]],
          [[0]],
          [[[]]],
          [[{}]],

          [["", undefined]],
        ],
      },

      {
        asserter: _ArrayOfNumber,
        values: [[[undefined]], [[null]], [[false]], [[""]], [[[]]], [[{}]]],
      },
    ];

    for (const { asserter, values } of testCases) {
      for (const [value, issues] of values) {
        assertThrows(
          () => asserter.assert(value),
          TypeAssertionError,
          new TypeAssertionError(asserter.typeName, value, { issues }).message,
        );
      }
    }
  });
});

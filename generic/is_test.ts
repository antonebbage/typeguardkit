import { assertStrictEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { _string } from "../mod.ts";
import { is } from "./is.ts";

describe("is", () => {
  it("should return `true` if `asserter` does not throw an error for `value`", () => {
    const testCases = ["", "a"];

    for (const value of testCases) {
      assertStrictEquals(is(_string, value), true);
    }
  });

  it("should return `false` if `asserter` does throw an error for `value`", () => {
    const testCases = [undefined, null, false, 0, [], {}];

    for (const value of testCases) {
      assertStrictEquals(is(_string, value), false);
    }
  });
});

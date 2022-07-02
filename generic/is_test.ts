import { assertStrictEquals, describe, it } from "/dev_deps.ts";
import { _string } from "../mod.ts";
import { is } from "./is.ts";

describe("is", () => {
  it("should return `true` if `asserter` does not throw an error for `value`", () => {
    assertStrictEquals(is(_string, ""), true);
    assertStrictEquals(is(_string, "a"), true);
  });

  it("should return `false` if `asserter` does throw an error for `value`", () => {
    assertStrictEquals(is(_string, undefined), false);
    assertStrictEquals(is(_string, null), false);
    assertStrictEquals(is(_string, false), false);
    assertStrictEquals(is(_string, 0), false);
    assertStrictEquals(is(_string, []), false);
    assertStrictEquals(is(_string, {}), false);
  });
});

import { assertStrictEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { isTypeNameOpen } from "./_is_type_name_open.ts";

describe("isTypeNameOpen", () => {
  const openTypeNames = [
    "A | B",
    "A & B",

    "A | B | C",
    "A & B & C",

    "A | Array<B | C>",
    "Array<A & B> & C",

    "A | (B | C)",
    "(A & B) & C",

    "Array<A | (B & C)> | D | (Array<E | F> & G)",
    "(Array<A & B> | C) & D & Array<E & (F | G)>",
  ];

  it("should return `true` if `typeName` describes a non-bracketed union or intersection", () => {
    for (const typeName of openTypeNames) {
      assertStrictEquals(isTypeNameOpen(typeName), true);
    }
  });

  it("should return `false` if `typeName` does not describe a non-bracketed union or intersection", () => {
    const testCases = [
      "",
      "A",
      ...openTypeNames.map((name) => `Array<${name}>`),
      ...openTypeNames.map((name) => `(${name})`),
    ];

    for (const typeName of testCases) {
      assertStrictEquals(isTypeNameOpen(typeName), false);
    }
  });
});

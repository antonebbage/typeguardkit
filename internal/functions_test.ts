import { assertStrictEquals } from "testing/asserts.ts";
import { describe, it } from "testing/bdd.ts";
import { checkTypeNameIsOpen } from "./functions.ts";

describe("checkTypeNameIsOpen", () => {
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
      assertStrictEquals(checkTypeNameIsOpen(typeName), true);
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
      assertStrictEquals(checkTypeNameIsOpen(typeName), false);
    }
  });
});

import { assertStrictEquals, describe, it } from "/dev_deps.ts";
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
    assertStrictEquals(checkTypeNameIsOpen(""), false);

    assertStrictEquals(checkTypeNameIsOpen("A"), false);

    for (const typeName of openTypeNames) {
      assertStrictEquals(checkTypeNameIsOpen(`Array<${typeName}>`), false);
    }
    for (const typeName of openTypeNames) {
      assertStrictEquals(checkTypeNameIsOpen(`(${typeName})`), false);
    }
  });
});

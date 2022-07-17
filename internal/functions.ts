// This module is browser-compatible.

/**
 * `checkTypeNameIsOpen` returns whether `typeName` describes a non-bracketed
 * union or intersection.
 */
export function checkTypeNameIsOpen(typeName: string): boolean {
  let bracketDepth = 0;

  for (const character of typeName) {
    if (/\||&/.test(character) && !bracketDepth) {
      return true;
    }

    if (/<|\(/.test(character)) {
      bracketDepth++;
    } else if (/>|\)/.test(character)) {
      bracketDepth--;
    }
  }

  return false;
}

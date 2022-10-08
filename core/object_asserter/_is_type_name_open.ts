// This module is browser-compatible.

/**
 * `isTypeNameOpen` returns whether `typeName` describes a non-bracketed union
 * or intersection.
 */
export function isTypeNameOpen(typeName: string): boolean {
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

import { assertStrictEquals, assertThrows, describe, it } from '/dev_deps.ts';
import { _string } from '../mod.ts';
import { assertIs } from './assert_is.ts';
import { errorMessage } from './asserter.ts';

describe('assertIs', () => {
  it('should return `undefined` if `asserter` does not throw an error for `value`', () => {
    assertStrictEquals(assertIs(_string, ''), undefined);
    assertStrictEquals(assertIs(_string, 'a'), undefined);
  });

  it('should allow an error thrown by `asserter` for `value` to bubble up', () => {
    assertThrows(
      () => assertIs(_string, undefined, 'name'),
      TypeError,
      errorMessage(undefined, 'string', 'name'),
    );

    assertThrows(
      () => assertIs(_string, undefined),
      TypeError,
      errorMessage(undefined, 'string'),
    );
    assertThrows(
      () => assertIs(_string, null),
      TypeError,
      errorMessage(null, 'string'),
    );
    assertThrows(
      () => assertIs(_string, false),
      TypeError,
      errorMessage(false, 'string'),
    );
    assertThrows(
      () => assertIs(_string, 0),
      TypeError,
      errorMessage(0, 'string'),
    );
    assertThrows(
      () => assertIs(_string, []),
      TypeError,
      errorMessage([], 'string'),
    );
    assertThrows(
      () => assertIs(_string, {}),
      TypeError,
      errorMessage({}, 'string'),
    );
  });
});

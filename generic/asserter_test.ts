import {
  assertStrictEquals,
  assertStringIncludes,
  describe,
  it,
} from '/dev_deps.ts';
import { errorMessage } from './asserter.ts';

describe('errorMessage', () => {
  it('should return correctly formatted message', () => {
    assertStrictEquals(
      errorMessage('', 'expectedTypeName1', 'valueName1'),
      '`valueName1` is of type `string`; expected type of `expectedTypeName1`',
    );
  });

  it('should return message including defined `valueName`', () => {
    assertStringIncludes(
      errorMessage('', '', 'valueName2'),
      '`valueName2` is of type',
    );
  });

  it('should return message including default `valueName` if `undefined`', () => {
    assertStringIncludes(errorMessage('', ''), '`value` is of type');
  });

  it('should return message including type of `value`', () => {
    assertStringIncludes(errorMessage(undefined, ''), 'is of type `undefined`');
    assertStringIncludes(errorMessage(null, ''), 'is of type `null`');
    assertStringIncludes(errorMessage(false, ''), 'is of type `boolean`');
    assertStringIncludes(errorMessage(0, ''), 'is of type `number`');
    assertStringIncludes(errorMessage([], ''), 'is of type `Array`');
    assertStringIncludes(errorMessage({}, ''), 'is of type `Object`');
  });

  it('should return message including `expectedTypeName`', () => {
    assertStringIncludes(
      errorMessage('', 'expectedTypeName2'),
      'expected type of `expectedTypeName2`',
    );
  });
});

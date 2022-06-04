# Type Guard Kit

[![ci](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml/badge.svg)](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml)

A TypeScript module to help create a type and its guards from a single source
definition.

## Usage

### `Asserter`s

An `Asserter` is a type assertion function.

```ts
interface Asserter<Type> {
  (value: unknown, name?: string): Type;
  readonly typeName: string;
}
```

If `value` is of `Type`, the `Asserter` should return `value` as `Type`.
Otherwise, the `Asserter` should throw a `TypeError` with a message created by
the `errorMessage` function.

The module includes the `_boolean`, `_number`, and `_string` `Asserter`s.

You can use an `Asserter` like this:

```ts
import { _string } from './mod.ts';

function handleUnknown(x: unknown) {
  let y;

  try {
    y = _string(x, 'x');
  } catch {
    return;
  }

  // `y` has now been initialized and inferred to be of type `string`, so can be
  // passed to `handleString`. `x` is still of `unknown` type though, so cannot.

  handleString(y);
}

function handleString(y: string) {}
```

You can create your own `Asserter` with the `type` function. For example, the
`_string` `Asserter` was created like this:

```ts
import { type } from './mod.ts';

export const _string = type(
  'string',
  (value): value is string => typeof value === 'string',
);
```

Prefixing `Asserter` names with an underscore `_` helps to avoid name conflicts
and shadowing.

### Assertion signature wrapper

The `assertIs` function wraps an `Asserter<Type>` with an assertion signature so
the value passed in can be narrowed to `Type`. If the `Asserter` throws an
error, it will bubble up. Otherwise, `assertIs` will not return a value, but
after calling it, the value passed in will be narrowed to `Type`.

You can use `assertIs` like this:

```ts
import { _string, assertIs } from './mod.ts';

function handleUnknown(x: unknown) {
  try {
    assertIs(_string, x, 'x');
  } catch {
    return;
  }

  // `x` has now been narrowed to type `string`, so can be passed to
  // `handleString`.

  handleString(x);
}

function handleString(x: string) {}
```

### Predicate signature wrapper

The `is` function wraps an `Asserter<Type>` with a predicate signature, creating
a type guard, so the value passed in can be narrowed to `Type`. If the
`Asserter` throws an error, `is` will catch it and return `false`. Otherwise,
`is` will return `true`.

You can use `is` like this:

```ts
import { _string, is } from './mod.ts';

function handleUnknown(x: unknown) {
  if (is(_string, x)) {
    // `x` has now been narrowed to type `string`, so can be passed to
    // `handleString`.
    handleString(x);
  }
}

function handleString(x: string) {}
```

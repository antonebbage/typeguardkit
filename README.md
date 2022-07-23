# Type Guard Kit

[![ci](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml/badge.svg)](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/antonebbage/typeguardkit/branch/main/graph/badge.svg?token=SL3A2OQ4W6)](https://codecov.io/gh/antonebbage/typeguardkit)

A TypeScript module to help construct type assertion functions and type guards.

You can use the included functions to create types and their assertion functions
and guards from a single source definition, and use type assertion functions and
guards to catch unexpected, incompatible types entering your application due to
interface definitions being outdated without versioning protection from breaking
changes, interfaces not being adhered to, or data being corrupted.

## Setup

### Deno module URL

```
https://deno.land/x/typeguardkit/mod.ts
```

### npm installation

```sh
npm install typeguardkit
```

## Usage

### Example

```ts
import {
  _boolean,
  _null,
  _number,
  _string,
  arrayOf,
  ObjectAsserter,
  objectAsserter,
  unionOf,
} from "./mod.ts";
// import from "typeguardkit" if using npm

// types/book.ts

const asserter = objectAsserter("Book", {
  isbn: _string,
  title: _string,
  authors: arrayOf(_string),
  pageCount: _number,
  rating: unionOf([_number, _null]),
  isRecommended: _boolean,
});

export type Book = ReturnType<typeof asserter>;

export const _Book: ObjectAsserter<Book> = asserter;

// api/get_book.ts

export async function getBook(isbn: string): Promise<Book> {
  const response = await fetch(`/api/books/${isbn}`);
  const responseBody = await response.json();

  // If `responseBody` is a `Book`, `_Book` returns `responseBody` as `Book`.
  // Otherwise, `_Book` throws a `TypeAssertionError`, including the optional
  // value name `"responseBody"` in its `message`.

  return _Book(responseBody, "responseBody");
}

// local_storage/reading_list_isbns.ts

export const readingListIsbnsKey = "reading-list-isbns";

export function getReadingListIsbns(): string[] {
  const json = localStorage.getItem(readingListIsbnsKey);
  return json ? arrayOf(_string)(JSON.parse(json)) : [];
}

export function setReadingListIsbns(isbns: readonly string[]): void {
  localStorage.setItem(readingListIsbnsKey, JSON.stringify(isbns));
}
```

### `Asserter`s

An `Asserter` is a type assertion function.

```ts
interface Asserter<Type> {
  (value: unknown, name?: string): Type;
  readonly typeName: string;
}
```

If `value` is of `Type`, the `Asserter` should return `value` as `Type`.
Otherwise, the `Asserter` should throw a `TypeAssertionError`.

The module includes the `_boolean`, `_number`, and `_string` `Asserter`s.

It also includes the `_null` and `_undefined` `Asserter`s, which can be used to
create union type `Asserter`s with the [`unionOf`](#unionof) function.

As well as wrapping `Asserter`s in the
[`assertIs`](#assertion-signature-wrapper) or
[`is`](#predicate-signature-wrapper) functions, you can use them like this:

```ts
import { _string } from "./mod.ts";
// import from "typeguardkit" if using npm

function handleUnknown(x: unknown) {
  let y;

  try {
    y = _string(x, "x");
  } catch {
    return;
  }

  // `y` has now been initialized and inferred to be of type `string`, so can be
  // passed to `handleString`. `x` is still of `unknown` type though, so cannot.

  handleString(y);
}

function handleString(y: string) {}
```

You can create your own `Asserter`s with the `typeAsserter` function. For
example, the `_string` `Asserter` was created like this:

```ts
import { typeAsserter } from "./mod.ts";
// import from "typeguardkit" if using npm

export const _string = typeAsserter(
  "string",
  (value): value is string => typeof value === "string",
);
```

Prefixing `Asserter` names with an underscore `_` helps to avoid name conflicts
and shadowing.

### Assertion signature wrapper

The `assertIs` function wraps an `Asserter<Type>` with an
[assertion signature](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
so the value passed in can be narrowed to `Type`. If the `Asserter` throws an
error, it will bubble up. Otherwise, `assertIs` will not return a value, but
after calling it, the value passed in will be narrowed to `Type`.

You can use `assertIs` like this:

```ts
import { _string, assertIs } from "./mod.ts";
// import from "typeguardkit" if using npm

function handleUnknown(x: unknown) {
  try {
    assertIs(_string, x, "x");
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

The `is` function wraps an `Asserter<Type>` with a
[predicate signature](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates),
creating a type guard, so the value passed in can be narrowed to `Type`. If the
`Asserter` throws an error, `is` will catch it and return `false`. Otherwise,
`is` will return `true`.

You can use `is` like this:

```ts
import { _string, is } from "./mod.ts";
// import from "typeguardkit" if using npm

function handleUnknown(x: unknown) {
  if (is(_string, x)) {
    // `x` has now been narrowed to type `string`, so can be passed to
    // `handleString`.

    handleString(x);
  }
}

function handleString(x: string) {}
```

### Enum `Asserter`s

You can create an `Asserter` for an enum type using the `enumAsserter` function
like this:

```ts
import { Asserter, enumAsserter, is } from "./mod.ts";
// import from "typeguardkit" if using npm

// types/direction.ts

export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

export const _Direction = enumAsserter("Direction", Direction);

// elsewhere.ts

function handleUnknown(x: unknown) {
  if (is(_Direction, x)) {
    // `x` has now been narrowed to type `Direction`, so can be passed to
    // `handleDirection`.

    handleDirection(x);
  }
}

function handleDirection(x: Direction) {}
```

### Literal union `Asserter`s

You can create an `Asserter` for a literal union type using the
`literalUnionAsserter` function like this:

```ts
import { Asserter, is, literalUnionAsserter } from "./mod.ts";
// import from "typeguardkit" if using npm

// types/direction.ts

export const directions = ["up", "right", "down", "left"] as const;

const asserter = literalUnionAsserter("Direction", directions);

export type Direction = typeof directions[number];

export const _Direction: Asserter<Direction> = asserter;

// elsewhere.ts

function handleUnknown(x: unknown) {
  if (is(_Direction, x)) {
    // `x` has now been narrowed to type `Direction`, so can be passed to
    // `handleDirection`.

    handleDirection(x);
  }
}

function handleDirection(x: Direction) {}
```

### Other `Asserter` factory functions

The following functions create new `Asserter`s from existing ones.

#### `unionOf`

`unionOf` returns an `Asserter` for the union of the `Type`s of the provided
`Asserter`s.

You can use `unionOf` like this:

```ts
import { _null, _string, is, unionOf } from "./mod.ts";
// import from "typeguardkit" if using npm

const _stringOrNull = unionOf([_string, _null]);

function handleUnknown(x: unknown) {
  if (is(_stringOrNull, x)) {
    // `x` has now been narrowed to type `string | null`, so can be passed to
    // `handleStringOrNull`.

    handleStringOrNull(x);
  }
}

function handleStringOrNull(x: string | null) {}
```

#### `arrayOf`

`arrayOf` returns an `Asserter<Array<Type>>`, created using the provided
`Asserter<Type>`.

You can use `arrayOf` like this:

```ts
import { _string, arrayOf, is } from "./mod.ts";
// import from "typeguardkit" if using npm

const _arrayOfString = arrayOf(_string);

function handleUnknown(x: unknown) {
  if (is(_arrayOfString, x)) {
    // `x` has now been narrowed to type `Array<string>`, so can be passed to
    // `handleArrayOfString`.

    handleArrayOfString(x);
  }
}

function handleArrayOfString(x: string[]) {}
```

### `ObjectAsserter`s

An `ObjectAsserter` is an `Asserter` for the object type defined by its
`propertyAsserters`.

```ts
import { Asserter } from "./mod.ts";
// import from "typeguardkit" if using npm

interface ObjectAsserter<Type extends Record<string, unknown>>
  extends Asserter<Type> {
  readonly propertyAsserters: Readonly<
    { [Key in keyof Type]-?: Asserter<Type[Key]> }
  >;
}
```

You can create an `ObjectAsserter` with the `objectAsserter` function and use it
like this:

```ts
import { _number, _string, is, ObjectAsserter, objectAsserter } from "./mod.ts";
// import from "typeguardkit" if using npm

// types/user.ts

const asserter = objectAsserter("User", {
  name: _string,
  age: _number,
});

export type User = ReturnType<typeof asserter>;

export const _User: ObjectAsserter<User> = asserter;

// elsewhere.ts

function handleUnknown(x: unknown) {
  if (is(_User, x)) {
    // `x` has now been narrowed to type `User`, so can be passed to
    // `handleUser`.

    handleUser(x);
  }
}

function handleUser(x: User) {}
```

### Other `ObjectAsserter` factory functions

The following functions create new `ObjectAsserter`s from existing ones.

#### `objectIntersectionOf`

`objectIntersectionOf` returns an `ObjectAsserter` for the intersection of the
`Type`s of the provided `ObjectAsserter`s.

You can use `objectIntersectionOf` like this:

```ts
import {
  _string,
  is,
  ObjectAsserter,
  objectAsserter,
  objectIntersectionOf,
} from "./mod.ts";
// import from "typeguardkit" if using npm

// types/entity.ts

const entityAsserter = objectAsserter("Entity", {
  id: _string,
});

export type Entity = ReturnType<typeof entityAsserter>;

export const _Entity: ObjectAsserter<Entity> = entityAsserter;

// types/user.ts

const userAsserter = objectIntersectionOf(
  _Entity,
  objectAsserter("", {
    name: _string,
  }),
  "User",
);

export type User = ReturnType<typeof userAsserter>;

export const _User: ObjectAsserter<User> = userAsserter;

// elsewhere.ts

function handleUnknown(x: unknown) {
  if (is(_User, x)) {
    // `x` has now been narrowed to type `User`, so can be passed to
    // `handleUser`.

    handleUser(x);
  }
}

function handleUser(x: User) {}
```

#### `partialFrom`

`partialFrom` returns an `ObjectAsserter<Partial<Type>>`, created using the
provided `ObjectAsserter<Type>`.

[`Partial<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)
is a utility type that constructs a type the same as `Type`, but with all
properties made optional.

You can use `partialFrom` like this:

```ts
import { _string, ObjectAsserter, objectAsserter, partialFrom } from "./mod.ts";
// import from "typeguardkit" if using npm

const asserter = partialFrom(
  objectAsserter("", {
    option1: _string,
    option2: _string,
    option3: _string,
  }),
  "Options",
);

export type Options = ReturnType<typeof asserter>;

export const _Options: ObjectAsserter<Options> = asserter;
```

#### `pickFrom`

`pickFrom` returns an `ObjectAsserter<Pick<Type, Keys[number]>>`, created using
the provided `ObjectAsserter<Type>` and `Keys`.

[`Pick<Type, Keys>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)
is a utility type that constructs a type consisting of the properties of `Type`
with `Keys`.

You can use `pickFrom` like this:

```ts
import { _string, ObjectAsserter, objectAsserter, pickFrom } from "./mod.ts";
// import from "typeguardkit" if using npm

// types/user.ts

const userAsserter = objectAsserter("User", {
  id: _string,
  firstName: _string,
  lastName: _string,
});

export type User = ReturnType<typeof userAsserter>;

export const _User: ObjectAsserter<User> = userAsserter;

// types/user_name.ts

const userNameAsserter = pickFrom(_User, ["firstName", "lastName"]);

export type UserName = ReturnType<typeof userNameAsserter>;

export const _UserName: ObjectAsserter<UserName> = userNameAsserter;
```

# TypeGuardKit

[![ci](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml/badge.svg?event=push)](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/antonebbage/typeguardkit/branch/main/graph/badge.svg?token=SL3A2OQ4W6)](https://codecov.io/gh/antonebbage/typeguardkit)
[![deno doc](https://doc.deno.land/badge.svg)](https://deno.land/x/typeguardkit/mod.ts)

**⚠️ API not yet stable**

A TypeScript module to help construct type assertion functions and type guards.

The included functions can be used to create types and their assertion functions
and guards from a single source definition.

Type assertion functions and guards can be used to catch incompatible types
entering your program due to data corruption, interfaces not being adhered to,
or interface definitions being outdated without versioning protection from
breaking changes.

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

### Example `import`s

Where you see relative `import` paths in documentation examples, instead
`import` `from "https://deno.land/x/typeguardkit/mod.ts"` if using Deno, or
`from "typeguardkit"` if using npm.

### Example

```ts
import {
  _boolean,
  _null,
  _number,
  _PositiveInteger,
  _string,
  arrayOf,
  ObjectAsserter,
  unionOf,
} from "./mod.ts";

// types/book.ts

const asserter = new ObjectAsserter("Book", {
  isbn: _string,
  title: _string,
  authors: arrayOf(_string),
  pageCount: _PositiveInteger,
  rating: unionOf(_number, _null),
  recommended: _boolean,
});

export type Book = ReturnType<typeof asserter.assert>;

export const _Book: ObjectAsserter<Book> = asserter;

// api/get_book.ts

export async function getBook(isbn: string): Promise<Book> {
  const response = await fetch(`/api/books/${isbn}`);

  const responseBody = await response.json();

  // If `responseBody` is a `Book`, `_Book` returns `responseBody` as `Book`.
  // Otherwise, `_Book` throws a `TypeAssertionError`, including the optional
  // value name `"responseBody"` in its `message`.

  return _Book.assert(responseBody, "responseBody");
}

// local_storage/reading_list_isbns.ts

export const readingListIsbnsKey = "reading-list-isbns";

export function getReadingListIsbns(): string[] {
  const json = localStorage.getItem(readingListIsbnsKey);

  return json ? arrayOf(_string).assert(JSON.parse(json)) : [];
}

export function setReadingListIsbns(isbns: readonly string[]): void {
  localStorage.setItem(readingListIsbnsKey, JSON.stringify(isbns));
}
```

### `Asserter`

An `Asserter<Type>` has a type assertion method, `assert`, that asserts whether
the provided `value` is of `Type`.

```ts
interface Asserter<Type> {
  readonly typeName: string;

  assert(value: unknown, valueName?: string): Type;
}
```

If `value` is of `Type`, `assert` should return `value` as `Type`. Otherwise,
`assert` should throw a `TypeAssertionError`, including `valueName` in its
`message`.

The module includes the `_boolean`, `_number`, `_string`, `_null`, and
`_undefined` primitive type `Asserter`s.

It also includes the `_NonNegativeNumber`, `_PositiveNumber`, `_Integer`,
`_NonNegativeInteger`, and `_PositiveInteger` `Asserter`s, which are `number`
`Asserter`s that perform additional validation.

The `_null` and `_undefined` `Asserter`s can be used to create union type
`Asserter`s with the [`unionOf`](#unionof) function.

As well as wrapping `Asserter`s in the
[`assertIs`](#assertion-signature-wrapper) or
[`is`](#predicate-signature-wrapper) functions, you can use them like this:

```ts
import { _string } from "./mod.ts";

function handleUnknown(x: unknown) {
  let y;

  try {
    y = _string.assert(x, "x");
  } catch {
    return;
  }

  // `y` has now been initialized and inferred to be of type `string`, so can be
  // passed to `handleString`. `x` is still of `unknown` type though, so cannot.

  handleString(y);
}

function handleString(y: string) {}
```

You can create your own `Asserter`s using the `TypeAsserter` class. For example,
the `_string` `Asserter` was created like this:

```ts
import { TypeAsserter } from "./mod.ts";

export const _string = new TypeAsserter(
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

Example:

```ts
import { _string, assertIs } from "./mod.ts";

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

Example:

```ts
import { _string, is } from "./mod.ts";

function handleUnknown(x: unknown) {
  if (is(_string, x)) {
    // `x` has now been narrowed to type `string`, so can be passed to
    // `handleString`.

    handleString(x);
  }
}

function handleString(x: string) {}
```

### `NumberAsserter`

A `NumberAsserter` is an `Asserter<number>`, with any additional validation
defined by its `NumberAsserterOptions` properties.

The provided `NumberAsserterOptions` are made accessible as properties of the
created `NumberAsserter`.

Example:

```ts
import { NumberAsserter } from "./mod.ts";

export const _EvenNumberInRange = new NumberAsserter("EvenNumberInRange", {
  min: { value: 0, inclusive: true },
  max: { value: 100, inclusive: true },
  step: 2,
});
```

### `StringAsserter`

A `StringAsserter` is an `Asserter<string>`, with any additional validation
defined by its `StringAsserterOptions` properties.

The provided `StringAsserterOptions` are made accessible as properties of the
created `StringAsserter`.

Example:

```ts
import { StringAsserter } from "./mod.ts";

export const _NonEmptyString = new StringAsserter("NonEmptyString", {
  minLength: 1,
});

export const _NumericString = new StringAsserter("NumericString", {
  regex: { pattern: "\\d+", requirements: ["must be numeric"] },
});

export const _Palindrome = new StringAsserter("Palindrome", {
  validate(value) {
    if (value.length < 2) {
      return [];
    }

    const forwardValue = value.replace(/[^0-9a-z]/gi, "");
    const backwardValue = forwardValue.split("").reverse().join("");

    return forwardValue === backwardValue ? [] : ["must be a palindrome"];
  },
});
```

### `LiteralUnionAsserter`

A `LiteralUnionAsserter` is an `Asserter` for the union of its `values`.

The provided `values` are made accessible as a property of the created
`LiteralUnionAsserter`.

Example:

```ts
import { LiteralUnionAsserter } from "./mod.ts";

const asserter = new LiteralUnionAsserter(
  "Direction",
  ["up", "right", "down", "left"],
);

export type Direction = ReturnType<typeof asserter.assert>;

export const _Direction: LiteralUnionAsserter<readonly Direction[]> = asserter;
```

### `EnumAsserter`

An `EnumAsserter` is an `Asserter` for the union of the member types of the
provided `enumObject`.

The provided `enumObject` is made accessible as a property of the created
`EnumAsserter`.

Example:

```ts
import { EnumAsserter } from "./mod.ts";

export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

export const _Direction = new EnumAsserter("Direction", Direction);
```

### `UnionAsserter`

A `UnionAsserter` is an `Asserter` for the union of the `Type`s of its
`memberAsserters`.

The provided `memberAsserters` are made accessible as a property of the created
`UnionAsserter`.

Example:

```ts
import { _null, _string, UnionAsserter } from "./mod.ts";

export const _stringOrNull = new UnionAsserter(
  "stringOrNull",
  [_string, _null],
);
```

#### `unionOf`

The `unionOf` function can be used to create a `UnionAsserter` without
specifying a `typeName`.

Example:

```ts
import { _null, _string, unionOf } from "./mod.ts";

export const _stringOrNull = unionOf(_string, _null);
```

### `ArrayAsserter`

An `ArrayAsserter` is an `Asserter` for the `Array` type defined by its
`elementAsserter`, with any additional validation defined by its
`ArrayAsserterOptions` properties.

The provided `memberAsserter` and `ArrayAsserterOptions` are made accessible as
properties of the created `ArrayAsserter`.

Example:

```ts
import { _string, ArrayAsserter } from "./mod.ts";

export const _NonEmptyArrayOfString = new ArrayAsserter(
  "NonEmptyArrayOfString",
  _string,
  { minLength: 1 },
);
```

#### `arrayOf`

The `arrayOf` function can be used to create an `ArrayAsserter` without
specifying a `typeName` or `ArrayAsserterOptions`.

Example:

```ts
import { _string, arrayOf } from "./mod.ts";

export const _ArrayOfString = arrayOf(_string);
```

### `RecordAsserter`

A `RecordAsserter` is an `Asserter` for the `Record` type defined by its
`keyAsserter` and `valueAsserter`.

The provided `keyAsserter` and `valueAsserter` are made accessible as properties
of the created `RecordAsserter`.

Example:

```ts
import { _string, RecordAsserter } from "./mod.ts";

export const _RecordOfStringByString = new RecordAsserter(
  "RecordOfStringByString",
  [_string, _string],
);
```

#### `recordOf`

The `recordOf` function can be used to create a `RecordAsserter` without
specifying a `typeName`.

Example:

```ts
import { _string, recordOf } from "./mod.ts";

export const _RecordOfStringByString = recordOf(_string, _string);
```

### `ObjectAsserter`

An `ObjectAsserter` is an `Asserter` for the object type defined by its
`propertyAsserters`.

The provided `propertyAsserters` are made accessible as a property of the
created `ObjectAsserter`.

Example:

```ts
import { _string, ObjectAsserter, optionOf } from "./mod.ts";

const asserter = new ObjectAsserter("User", {
  name: _string,
  emailAddress: optionOf(_string),
});

export type User = ReturnType<typeof asserter.assert>;

export const _User: ObjectAsserter<User> = asserter;
```

#### `objectIntersectionOf`

`objectIntersectionOf` returns an `ObjectAsserter` for the intersection of the
`Type`s of the provided `ObjectAsserter`s.

Example:

```ts
import { _string, ObjectAsserter, objectIntersectionOf } from "./mod.ts";

// types/entity.ts

const entityAsserter = new ObjectAsserter("Entity", {
  id: _string,
});

export type Entity = ReturnType<typeof entityAsserter.assert>;

export const _Entity: ObjectAsserter<Entity> = entityAsserter;

// types/user.ts

const userAsserter = objectIntersectionOf(
  _Entity,
  new ObjectAsserter("", {
    name: _string,
  }),
  "User",
);

export type User = ReturnType<typeof userAsserter.assert>;

export const _User: ObjectAsserter<User> = userAsserter;
```

#### `partialFrom`

`partialFrom` returns an `ObjectAsserter<Partial<Type>>`, created using the
provided `ObjectAsserter<Type>`.

[`Partial<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)
is a utility type that constructs a type the same as `Type`, but with all
properties made optional.

Example:

```ts
import { _string, ObjectAsserter, partialFrom } from "./mod.ts";

const asserter = partialFrom(
  new ObjectAsserter("", {
    option1: _string,
    option2: _string,
    option3: _string,
  }),
  "Options",
);

export type Options = ReturnType<typeof asserter.assert>;

export const _Options: ObjectAsserter<Options> = asserter;
```

#### `pickFrom`

`pickFrom` returns an `ObjectAsserter<Pick<Type, Keys[number]>>`, created using
the provided `ObjectAsserter<Type>` and `Keys`.

[`Pick<Type, Keys>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)
is a utility type that constructs a type consisting of the properties of `Type`
with `Keys`.

Example:

```ts
import { _string, ObjectAsserter, pickFrom } from "./mod.ts";

// types/user.ts

const userAsserter = new ObjectAsserter("User", {
  id: _string,
  firstName: _string,
  lastName: _string,
});

export type User = ReturnType<typeof userAsserter.assert>;

export const _User: ObjectAsserter<User> = userAsserter;

// types/user_name.ts

const userNameAsserter = pickFrom(_User, ["firstName", "lastName"]);

export type UserName = ReturnType<typeof userNameAsserter.assert>;

export const _UserName: ObjectAsserter<UserName> = userNameAsserter;
```

### The `TypeAssertionError` issue tree

A `TypeAssertionError` has an `issueTree` property of type
`TypeAssertionIssueTree`, which provides a tree representation of the issue data
contained in the error's `message`.

`TypeAssertionIssueTree` is an alias of `TypeAssertionIssueTreeNode` for typing
the root `TypeAssertionIssueTreeNode`.

A `TypeAssertionError` also has an `issueTreeNode` method to find the node at a
given `path`. The `path` separator is a forward slash, and a `path` segment can
be an object property name or array index.

`issueTreeNode` could be called to get the issue data for each field in a form,
for example:

```ts
import {
  _NonNegativeInteger,
  _string,
  assertIs,
  is,
  ObjectAsserter,
  TypeAssertionError,
} from "./mod.ts";

// types/item.ts

const itemAsserter = new ObjectAsserter("Item", {
  quantity: _NonNegativeInteger,
});

export type Item = ReturnType<typeof itemAsserter.assert>;

export const _Item: ObjectAsserter<Item> = itemAsserter;

// types/form.ts

const formAsserter = new ObjectAsserter("Form", {
  item: _Item,
});

export type Form = ReturnType<typeof formAsserter.assert>;

export const _Form: ObjectAsserter<Form> = formAsserter;

// elsewhere.ts

const form: Form = {
  item: {
    quantity: 0,
  },
};

let itemQuantityIssues: string[] = [];

function validateForm(): boolean {
  try {
    assertIs(_Form, form);
  } catch (error) {
    if (error instanceof TypeAssertionError) {
      const node = error.issueTreeNode("item/quantity");

      itemQuantityIssues = node?.issues
        ? node.issues.filter((issue) => is(_string, issue)) as string[]
        : [];
    }

    return false;
  }

  return true;
}
```

### Sending `TypeAssertionError`s to another program

A `TypeAssertionError`'s `toJSON` method returns a JSON representation of the
error's `issueTree`, which can then be sent to another program and used to
create a new `TypeAssertionError` there with the same `issueTree`.

In the receiving program, you can assert that a received object is a
`TypeAssertionIssueTree` using the `_TypeAssertionIssueTree` `Asserter`. You can
then create a `TypeAssertionError` by passing the asserted
`TypeAssertionIssueTree` to its constructor.

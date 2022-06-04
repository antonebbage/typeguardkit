# Type Guard Kit [![ci](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml/badge.svg)](https://github.com/antonebbage/typeguardkit/actions/workflows/ci.yml)

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

If `value` is of `Type`, it should return `value` as `Type`. Otherwise, it
should throw a `TypeError` with a message created by the `errorMessage`
function.

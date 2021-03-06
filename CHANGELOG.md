## [0.4.0](https://github.com/antonebbage/typeguardkit/compare/0.3.1...0.4.0) (2022-07-23)

### ⚠ BREAKING CHANGES

- add optional `typeName` parameter to `unionOf`

### Features

- add `partialFrom` function
  ([490cbe9](https://github.com/antonebbage/typeguardkit/commit/490cbe931d35936a50e6720e0e068a97f36f68ed))
- add `pickFrom` function
  ([b6ea6af](https://github.com/antonebbage/typeguardkit/commit/b6ea6af0d8ed964f864d5c061f4b44b5028cb4da))
- add optional `typeName` parameter to `arrayOf`
  ([4a8e150](https://github.com/antonebbage/typeguardkit/commit/4a8e15084ebc81ff8a12388add4bdf82c7bd3c08))
- add optional `typeName` parameter to `unionOf`
  ([92528f0](https://github.com/antonebbage/typeguardkit/commit/92528f0f300eebdb85d1eca796a846a7fdd1cb05))

## [0.3.1](https://github.com/antonebbage/typeguardkit/compare/0.3.0...0.3.1) (2022-07-18)

### Bug Fixes

- fix imports from https://deno.land/x/typeguardkit/mod.ts
  ([55e4090](https://github.com/antonebbage/typeguardkit/commit/55e40906fee0318405c6ad5db42ab96237f9feb3))

## [0.3.0](https://github.com/antonebbage/typeguardkit/compare/0.2.0...0.3.0) (2022-07-17)

### Features

- add `enumAsserter` function
  ([2b0d48d](https://github.com/antonebbage/typeguardkit/commit/2b0d48d0faabd388163f07dac1434b54630fabf7))
- add `objectIntersectionOf` function
  ([b091a63](https://github.com/antonebbage/typeguardkit/commit/b091a631b751be4eded33fefecf7c5679a0736e9))

### Bug Fixes

- correct `arrayOf` `TypeAssertionError` message
  ([5e01c9a](https://github.com/antonebbage/typeguardkit/commit/5e01c9a63f7158fe2f0b1984268ec0b8d8357912))
- correct `objectAsserter` `TypeAssertionError` message
  ([88e96e1](https://github.com/antonebbage/typeguardkit/commit/88e96e1d8f2ab3bb6a344907c37519d596cf9728))

## [0.2.0](https://github.com/antonebbage/typeguardkit/compare/0.1.0...0.2.0) (2022-07-09)

### ⚠ BREAKING CHANGES

- remove `nullOr` + `undefinedOr` functions
- rename `type` function to `typeAsserter`

### Features

- add `_null` and `_undefined` `Asserter`s
  ([075762f](https://github.com/antonebbage/typeguardkit/commit/075762fdd07245cdd8f5829b5b9027e7bbe5d9aa))
- add `literalUnionAsserter` function
  ([365a4b7](https://github.com/antonebbage/typeguardkit/commit/365a4b7ea71a1cc3f120944d319fe9e900948d76))
- remove `nullOr` + `undefinedOr` functions
  ([0945091](https://github.com/antonebbage/typeguardkit/commit/094509116dd89c9afba2eac3af1f3e8abae08211))
- rename `type` function to `typeAsserter`
  ([c29af83](https://github.com/antonebbage/typeguardkit/commit/c29af8338b10e6afc3bb1dc3c7d506ba6507e727))

## [0.1.0](https://github.com/antonebbage/typeguardkit/compare/ba0d2fa9fe1ec79403a2095f6ef899e1fe0ae4e8...0.1.0) (2022-07-02)

### Features

- add `arrayOf` function
  ([a25c3a4](https://github.com/antonebbage/typeguardkit/commit/a25c3a4a515589eda83d525b64edfec65027829c))
- add `Asserter` type + `errorMessage` function
  ([ba0d2fa](https://github.com/antonebbage/typeguardkit/commit/ba0d2fa9fe1ec79403a2095f6ef899e1fe0ae4e8))
- add `assertIs` function
  ([e89b717](https://github.com/antonebbage/typeguardkit/commit/e89b717b71e44ea237ea230145a3bd62b339a160))
- add `is` function
  ([55be207](https://github.com/antonebbage/typeguardkit/commit/55be207978ee0d73d59ed716e1ed6ce66ce2e4c1))
- add `nullOr` function
  ([96098e7](https://github.com/antonebbage/typeguardkit/commit/96098e741b6da226c68e665753c91c456b534c02))
- add `type` function + `Asserter`s
  ([f210d56](https://github.com/antonebbage/typeguardkit/commit/f210d567f126b7526fef1dfcf04526367ba3c44e))
- add `TypeAssertionError`
  ([241e34f](https://github.com/antonebbage/typeguardkit/commit/241e34ffe682aa6a634bb977decea8e6cf2154a9))
- add `undefinedOr` function
  ([f906499](https://github.com/antonebbage/typeguardkit/commit/f906499db92f03185fdef6b01ced443e5ef66713))
- add `unionOf` function
  ([4d4f05b](https://github.com/antonebbage/typeguardkit/commit/4d4f05bff7224d25db5f2581d59bc4e4ff3f225b))
- add object asserter type + factory function
  ([739f376](https://github.com/antonebbage/typeguardkit/commit/739f3761f7e94c8a70ac686b167d7925c41548eb))

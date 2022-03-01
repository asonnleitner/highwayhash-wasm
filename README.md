![highway-wasm](./docs/preview.png)

# highway-wasm

[![npm version][npm-version-src]][npm-href]
[![npm downloads][npm-downloads-src]][npm-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![License][license-src]][npm-href]

> JS bindings for browser and Node.js environment of the Rust implementation of HighwayHash, Google's fast, keyed, portable 
> (output is hardware independent) and secure hash function.

## Features

- Run on Node.js and browser with same API
- Zero dependencies
- Prebuilt and optimized WASM binary
- Generate hashes at over 2GB/s when running on SIMD enabled WebAssembly
- Generate 64, 128 and 256 bit hashes
- Output hash as string, hexadecimal string
- Hash data in chunks

## Install

Add `highway-wasm` dependency to your project:

```shell
# using npm
npm i highway-wasm

# using yarn
yarn add highway-wasm

# using pnpm
pnpm add highway-wasm
```

## Usage

Use this method to generate hashes is the length of the data is not known in advance:

```javascript
// import the library using esm or cjs syntax
import { Highway } from 'highway-wasm'
const { Highway } = require('highway-wasm')

// create a key which should be hidden from attackers to ensure unpredictability
const key = new Uint8Array(32).fill(8)

// initialize the WASM module and create a new hasher
const hasher = await Highway.init().then((hh) => hh.new(key))

// append some data
hasher.append(Uint8Array.from([0]))

// after all data has been appended, hash it to a 64, 128 or 256 bit output,
// don't forget to chain the finalized hash to the required output format.
const hash = hasher.finalize64().toString()
// example: '4652207699671410156'
```

The preferred way to use the library is to initiate the module and hash data and key with 
the `hash64`, `hash128` or `hash256` methods.

```javascript
// import the library using esm or cjs syntax
import { Highway } from 'highway-wasm'
const { Highway } = require('highway-wasm')

// create a key which should be hidden from attackers to ensure unpredictability
const key = new Uint8Array(32).fill(8)
const data = Uint8Array.from([0])

// initialize the WASM module and create a new hasher
const hasher = await Highway.init()

// after all data has been appended, hash it to a 64, 128 or 256 bit output,
// don't forget to chain the finalized hash to the required output format.
const hash = hasher.hash64(key, data).toString()
// example: '4652207699671410156'
```

## API

## `hasher`

The hasher initializes with SIMD if supported.

## `hash`

The following methods are available to output hashes:

### `toString`
```javascript
// returns the hash as a string
const hash = hasher.hash64(key, data).toString()
```
### `toHex`
```javascript
// returns the hash as a hexadecimal string
const hash = hasher.hash64(key, data).toHex()
```
### `toBinary`
```javascript
// returns the hash as a binary string
const hash = hasher.hash64(key, data).toBinary()
```
### `toOctal`
```javascript
// returns the hash as an octal string
const hash = hasher.hash64(key, data).toOctal()
```
### `toBytes`
```javascript
// returns the hash as a Uint8Array
const hash = hasher.hash64(key, data).toBytes()
```
### `toUint32Array`
```javascript
// returns the hash as a Uint32Array
const hash = hasher.hash64(key, data).toUint32Array()
```
### `toUint64Array`
```javascript
// returns the hash as a Uint64Array
const hash = hasher.hash64(key, data).toUint64Array()
```



<!-- badges -->
[npm-version-src]: https://badgen.net/npm/v/highway-wasm
[npm-href]: https://www.npmjs.com/package/highwayhash
[npm-downloads-src]: https://badgen.net/npm/dm/highway-wasm
[github-actions-ci-src]: https://github.com/asonnleitner/highway-wasm/actions/workflows/ci.yaml/badge.svg
[github-actions-ci-href]: https://github.com/asonnleitner/highway-wasm/actions/workflows/ci.yaml

[license-src]: https://badgen.net/npm/license/highway-wasm

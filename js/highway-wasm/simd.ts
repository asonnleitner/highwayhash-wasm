// https://github.com/GoogleChromeLabs/wasm-feature-detect/blob/master/src/detectors/simd/module.wat
export const simd = (): boolean =>
  WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10,
      1, 8, 0, 65, 0, 253, 15, 253, 98, 11
    ])
  )

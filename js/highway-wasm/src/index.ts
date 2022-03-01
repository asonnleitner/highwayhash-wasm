// highway
import init, { WasmHighway } from '../lib/highway/highway.js'
import { default as wasm } from '../lib/highway/highway_bg.wasm'
// highway simd
import initSimd, {
  WasmHighway as WasmHighwaySimd
} from '../lib/highway-simd/highway-simd'
import { default as wasmSimd } from '../lib/highway-simd/highway-simd_bg.wasm'

// https://github.com/GoogleChromeLabs/wasm-feature-detect/blob/master/src/detectors/simd/module.wat
export const simd = () =>
  WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10,
      1, 8, 0, 65, 0, 253, 15, 253, 98, 11
    ])
  )

export class Highway {
  static async init(options = { simd: true }) {
    const useSimd = simd() && options.simd
    if (useSimd) {
      await initSimd(wasmSimd)
      return WasmHighwaySimd
    } else {
      await init(wasm)
      return WasmHighway
    }
  }
}

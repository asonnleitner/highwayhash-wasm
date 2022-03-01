import { simd } from './simd'
// highway
import init, { WasmHighway } from './lib/highway/highway'
import { default as wasm } from './lib/highway/highway_bg.wasm'
// highway simd
import initSimd, {
  WasmHighway as WasmHighwaySimd
} from './lib/highway-simd/highway-simd'
import { default as wasmSimd } from './lib/highway-simd/highway-simd_bg.wasm'

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

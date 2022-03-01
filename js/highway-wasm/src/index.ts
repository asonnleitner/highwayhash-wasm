import init, { WasmHighway as Highway } from '../lib/highway/highway.js'
import { default as WASM } from '../lib/highway/highway_bg.wasm'
import initSimd, {
  WasmHighway as HighwaySimd
} from '../lib/highway-simd/highway-simd'
import { default as simdWASM } from '../lib/highway-simd/highway-simd_bg.wasm'

// https://github.com/GoogleChromeLabs/wasm-feature-detect/blob/master/src/detectors/simd/module.wat
export const useSimd = () =>
  WebAssembly.validate(
    new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10,
      1, 8, 0, 65, 0, 253, 15, 253, 98, 11
    ])
  )

const useModule = (hasher: typeof Highway) => (key: Uint8Array) => {
  if (key.length && key.length !== 32) throw new Error('Key must be 32 bytes')

  return {
    hasher,
    new: (key: Uint8Array) => hasher.new(key),
    hash64: (data: Uint8Array) => {
      const hh = hasher.new(key)
      hh.append(data)
      return hh.finalize64()
    },
    hash128: (data: Uint8Array) => {
      const hh = hasher.new(key)
      hh.append(data)
      return hh.finalize128()
    },
    hash256: (data: Uint8Array) => {
      const hh = hasher.new(key)
      hh.append(data)
      return hh.finalize256()
    }
  }
}

interface HighwayOptions {
  key?: Uint8Array
  simd?: boolean
}

export const useHighway = async (options?: HighwayOptions) => {
  const simd = useSimd() && (options?.simd ?? true)
  simd ? await initSimd(simdWASM) : await init(WASM)
  return useModule(simd ? HighwaySimd : Highway)(
    options?.key ?? Uint8Array.from({ length: 32 })
  )
}

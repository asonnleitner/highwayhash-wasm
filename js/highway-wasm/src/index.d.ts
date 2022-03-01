import { WasmHighway } from '../lib/highway/highway'

export type InitOptions = Record<'simd', boolean>

export class Highway {
  static init(options: InitOptions): Promise<typeof WasmHighway>
}

export function simd(): boolean

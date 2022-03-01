type UInt8ArrayFrom<T = any> = (
  arrayLike: ArrayLike<T>,
  mapFn: (v: T, k: number) => number,
  thisArg?: any
) => Uint8Array

const _UInt8ArrayFrom: UInt8ArrayFrom =
  typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (arrayLike, mapFn = (v) => v) =>
        new Uint8Array(Array.prototype.slice.call(arrayLike, 0).map(mapFn))

const _slice = Function.prototype.call.bind(Array.prototype.slice)

const hexToUint8 = (hex: string) =>
  _UInt8ArrayFrom({ length: hex.length / 2 }, (_, i) =>
    parseInt(_slice(hex, i * 2, i * 2 + 2).join(''), 16)
  )

const stringToUint8 = (s: string) =>
  _UInt8ArrayFrom(s, (v, k) => v.charCodeAt(0))

const isHex = (hex: string) =>
  hex.length % 2 === 0 && hex.length === 64 && /^[0-9a-f]+$/i.test(hex)

const isString = (s: string) => s.length > 0 && s.length <= 32 && !isHex(s)

export const useKey = (s: string): Uint8Array => {
  if (isHex(s)) return hexToUint8(s)
  if (isString(s)) return stringToUint8(s)

  throw new Error(`Invalid key: ${s}`)
}

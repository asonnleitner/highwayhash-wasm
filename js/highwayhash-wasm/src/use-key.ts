type UInt8ArrayFrom<T = any> = (
  arrayLike: ArrayLike<T>,
  mapFn: (v: T, k: number) => number,
  thisArg?: any
) => Uint8Array

const _UInt8ArrayFrom: UInt8ArrayFrom
  = typeof Uint8Array.from === 'function'
    ? Uint8Array.from.bind(Uint8Array)
    : (arrayLike, mapFn = v => v) =>
        new Uint8Array(Array.prototype.slice.call(arrayLike, 0).map(mapFn))

const _slice = Function.prototype.call.bind(Array.prototype.slice)

function hexToUint8(hex: string): Uint8Array {
  return _UInt8ArrayFrom({ length: hex.length / 2 }, (_, i) =>
    Number.parseInt(_slice(hex, i * 2, i * 2 + 2).join(''), 16))
}

function stringToUint8(s: string): Uint8Array {
  return _UInt8ArrayFrom(s, (v, k) => v.charCodeAt(0))
}

function isHex(hex: string): boolean {
  return hex.length % 2 === 0 && hex.length === 64 && /^[0-9a-f]+$/i.test(hex)
}

const isString = (value: string): value is string => value.length > 0 && value.length <= 32 && !isHex(value)

export function useKey(value: string): Uint8Array {
  if (isHex(value))
    return hexToUint8(value)
  if (isString(value))
    return stringToUint8(value)
  throw new Error(`Invalid key: ${value}`)
}

// import the library
import { useHighwayHash } from 'highwayhash-wasm'

// Load the wasm module
async function main(): Promise<void> {
  // Some 32 byte key
  const key = new Uint8Array(32).fill(8)
  // Some data to hash
  const data = Uint8Array.from([0])

  // Load the wasm module which returns the the Highway object
  const highway = await useHighwayHash({
    // Optional: pass a key and keep it hidden from attackers to ensure
    // unpredictability, and attackers can't mount a DoS attack
    key,
    // Optional: use SIMD for faster encryption, enabled by default
    simd: true,
  })

  // 1. method - encrypt data with Highway and return the hash
  const h1 = highway.hash64(data).toString()
  // eslint-disable-next-line no-console
  console.log(h1) // 4652207699671410156

  // 2. method - if the data to hash is not known, create a hasher, and append
  // the data.
  const hasher = highway.new(key)
  hasher.append(data)
  // After all data is appended, call the hash method to get the hash
  // do not call any additional methods on the hasher after finalizing
  const h2 = hasher.finalize64().toString()
  // eslint-disable-next-line no-console
  console.log(h2) // 4652207699671410156

  // 3. method - hash the data with separate key and data
  const h3 = highway.hasher.hash64(key, data).toString()
  // eslint-disable-next-line no-console
  console.log(h3) // 4652207699671410156

  // eslint-disable-next-line no-console
  console.log({ h1, h2, h3 })
}

main().catch((err) => {
  throw err
})

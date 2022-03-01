// import the library
import { Highway } from 'highway-wasm'

// Load the wasm module
const main = async () => {
  const key = new Uint8Array(32).fill(8)
  const data = Uint8Array.from([0])

  // initialize the WASM module and create a new hasher
  const hasher = await Highway.init()

  // after all data has been appended, hash it to a 64, 128 or 256 bit output,
  // don't forget to chain the finalized hash to the required output format.
  const hash = hasher.hash64(key, data).toString()
  // example: '4652207699671410156'

  console.log({ hash })
}

main().catch((err) => {
  throw err
})

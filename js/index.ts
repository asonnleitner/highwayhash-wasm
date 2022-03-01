import { Highway } from 'highway-wasm'

const key = new Uint8Array(32).fill(8)
const data = new Uint8Array(32).fill(1)

const main = async () => {
  const hasher = await Highway.init()
  const hash = hasher.hash64(key, data).toBinary()

  console.log({ hash })
}

main().catch((err) => {
  throw err
})

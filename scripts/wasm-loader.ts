import { Plugin } from 'esbuild'
import path from 'path'
import fs from 'fs'

interface WasmLoaderOptions {
  name: string
}

const wasmLoader = (options?: WasmLoaderOptions): Plugin => ({
  name: 'wasm-loader',

  setup(build) {
    build.onResolve({ filter: /\.wasm$/ }, (args) => {
      if (args.resolveDir === '') {
        return
      }

      return {
        path: path.isAbsolute(args.path)
          ? args.path
          : path.join(args.resolveDir, args.path),
        namespace: 'wasm-binary'
      }
    })

    build.onLoad({ filter: /.*/, namespace: 'wasm-binary' }, async (args) => ({
      contents: await fs.promises.readFile(args.path),
      loader: 'binary'
    }))

    build.onLoad({ filter: /.*/, namespace: 'wasm-stub' }, async (args) => ({
      contents: `import wasm from ${JSON.stringify(args.path)}
      export default async (imports) =>
        (await WebAssembly.instantiate(wasm, imports)).instance.exports`
    }))
  }
})

export default wasmLoader

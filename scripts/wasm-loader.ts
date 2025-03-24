import type { Plugin } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'

interface WasmLoaderOptions {
  name: string
}

function wasmLoader(_options?: WasmLoaderOptions): Plugin {
  return {
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
          namespace: 'wasm-binary',
        }
      })

      build.onLoad({ filter: /.*/, namespace: 'wasm-binary' }, async args => ({
        contents: await fs.promises.readFile(args.path),
        loader: 'binary',
      }))

      build.onLoad({ filter: /.*/, namespace: 'wasm-stub' }, async args => ({
        contents: `import wasm from ${JSON.stringify(args.path)}
      export default async (imports) =>
        (await WebAssembly.instantiate(wasm, imports)).instance.exports`,
      }))
    },
  }
}

export default wasmLoader

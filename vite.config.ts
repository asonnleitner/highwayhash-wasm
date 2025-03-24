import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      'highwayhash-wasm': resolve(__dirname, 'js/highwayhash-wasm/src'),
    },
  },
})

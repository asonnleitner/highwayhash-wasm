import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'highwayhash-wasm': resolve(__dirname, 'js/highwayhash-wasm/src')
    }
  }
})

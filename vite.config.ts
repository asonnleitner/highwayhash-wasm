import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      'highway-wasm': resolve(__dirname, 'js/highway-wasm/src')
    }
  }
})

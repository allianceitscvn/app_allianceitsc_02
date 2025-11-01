import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@workspace/ui': resolve(__dirname, '../../packages/ui/src'),
            '@workspace/lib': resolve(__dirname, '../../packages/lib/src'),
        },
    },
})

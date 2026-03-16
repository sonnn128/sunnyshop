import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            // Support frontend-template style imports (without @ prefix)
            'components': path.resolve(__dirname, './src/components'),
            'pages': path.resolve(__dirname, './src/pages'),
            'contexts': path.resolve(__dirname, './src/contexts'),
            'lib': path.resolve(__dirname, './src/lib'),
            'store': path.resolve(__dirname, './src/store'),
            'utils': path.resolve(__dirname, './src/utils'),
            'styles': path.resolve(__dirname, './src/styles'),
            'hooks': path.resolve(__dirname, './src/hooks'),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
})

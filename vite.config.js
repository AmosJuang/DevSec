import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    publicDir: 'public', // Ensure this is set correctly
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
    },
    server: {
        host: "0.0.0.0",
        port: 3000
    },
    preview: {
        port: 3001
    }
});
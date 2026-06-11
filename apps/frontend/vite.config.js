import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load env variables from the workspace/current directory
    const env = loadEnv(mode, process.cwd(), '');
    const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:3000';

    return {
        server: {
            host: true, // Allow connections from outside the container (e.g. host machine)
            port: 5173,
            proxy: {
                '/api': {
                    target: backendUrl,
                    changeOrigin: true,
                },
                '/uploads': {
                    target: backendUrl,
                    changeOrigin: true,
                }
            }
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
        }
    };
});

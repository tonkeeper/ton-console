/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './tests/setup.ts',
        typecheck: {
            tsconfig: './tsconfig.test.json'
        }
    }
});

/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default ({ mode }) => {
    const { VITE_TG_OAUTH_BOT_NAME, VITE_BASE_PROXY_URL, VITE_CD_CHECK_STRING } = loadEnv(
        mode,
        process.cwd()
    );

    return defineConfig({
        plugins: [
            tsconfigPaths(),
            react(),
            mkcert(),
            createHtmlPlugin({
                entry: '/src/main.tsx',
                inject: {
                    data: {
                        injectScript: `<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="${VITE_TG_OAUTH_BOT_NAME}" data-userpic="false" data-request-access="write" onload="setTimeout(document.getElementById('telegram-login-${VITE_TG_OAUTH_BOT_NAME}').style.display = 'none')"></script>`
                    },
                    tags: [
                        {
                            injectTo: 'body-prepend',
                            tag: 'div',
                            attrs: {
                                id: 'root'
                            }
                        },
                        {
                            injectTo: 'head',
                            tag: 'meta',
                            attrs: {
                                'data-cd-check': VITE_CD_CHECK_STRING
                            }
                        }
                    ]
                }
            })
        ],
        server: {
            host: '127.0.0.1',
            port: 5173,
            https: true,
            watch: {
                usePolling: true
            },
            proxy: {
                '/api': {
                    target: VITE_BASE_PROXY_URL,
                    changeOrigin: true,
                    secure: true,
                    cookiePathRewrite: '/',
                    headers: {
                        Connection: 'keep-alive'
                    }
                }
            }
        },
        optimizeDeps: {
            esbuildOptions: {
                define: {
                    global: 'globalThis'
                },
                plugins: [
                    NodeGlobalsPolyfillPlugin({
                        buffer: true
                    })
                ]
            }
        },
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './tests/setup.ts',
            typecheck: {
                tsconfig: './tsconfig.test.json'
            }
        }
    });
};

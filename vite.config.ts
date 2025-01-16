/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createHtmlPlugin } from 'vite-plugin-html';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default ({ mode }) => {
    const { VITE_TG_OAUTH_BOT_NAME, VITE_BASE_PROXY_URL, VITE_CD_CHECK_STRING, VITE_GTM_ID } =
        loadEnv(mode, process.cwd());

    const tgScript = makeTgAuthScript(VITE_TG_OAUTH_BOT_NAME);
    const gtmScrip = mode === 'production' ? makeGtmScript(VITE_GTM_ID) : '';
    const yMetrikaScript = mode === 'production' ? makeYMetrikaScript() : '';

    return defineConfig({
        plugins: [
            tsconfigPaths(),
            react(),
            mkcert(),
            createHtmlPlugin({
                entry: '/src/main.tsx',
                inject: {
                    data: {
                        injectScript: tgScript + gtmScrip + yMetrikaScript
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
            }),
            nodePolyfills({
                globals: {
                    Buffer: true
                }
            })
        ],
        server: {
            host: '127.0.0.1',
            port: 5173,
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
                },
                '/streaming-api': {
                    target: VITE_BASE_PROXY_URL,
                    changeOrigin: true,
                    secure: true,
                    cookiePathRewrite: '/',
                    headers: {
                        Connection: 'keep-alive'
                    }
                },
                '/airdrop-api': {
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
        build: {
            rollupOptions: {
                onwarn(warning, warn) {
                    // TODO: check and fix this warnings
                    const warningExportDefault =
                        warning.code === 'CYCLIC_CROSS_CHUNK_REEXPORT' &&
                        warning.message.includes(`Export "default"`);
                    const warningUseClient =
                        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
                        warning.message.includes(`"use client"`);

                    if (warningExportDefault || warningUseClient) {
                        return;
                    }

                    warn(warning);
                }
            }
        }

        // test: {
        //     globals: true,
        //     environment: 'jsdom',
        //     setupFiles: './tests/setup.ts',
        //     typecheck: {
        //         tsconfig: './tsconfig.test.json'
        //     }
        // }
    });
};

function makeTgAuthScript(botName) {
    return `<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="${botName}" data-userpic="false" data-request-access="write" onload="setTimeout(() => document.getElementById('telegram-login-${botName}').style.display = 'none')"></script>`;
}

function makeGtmScript(gtmId) {
    return `<script async src="https://www.googletagmanager.com/gtag/js?id=${gtmId}"></script><script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","${gtmId}");</script>`;
}

function makeYMetrikaScript() {
    return `
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

   ym(99709953, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>`;
}

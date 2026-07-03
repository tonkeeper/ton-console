import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import svgr from "vite-plugin-svgr"
import { defineConfig, loadEnv } from "vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiProxyTarget = env.VITE_BASE_PROXY_URL ?? "https://tonconsole.com"
  const telegramBotName = env.VITE_TG_OAUTH_BOT_NAME
  const devAuthCookie = env.VITE_DEV_AUTH_COOKIE
  const apiProxyHeaders = devAuthCookie
    ? {
        Cookie: devAuthCookie,
      }
    : undefined

  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        include: "**/*.svg",
      }),
      {
        name: "ton-console-html-tags",
        transformIndexHtml(html) {
          const tags = []

          if (telegramBotName) {
            tags.push({
              tag: "script",
              attrs: {
                id: "telegram-login-widget-script",
                async: true,
                src: "https://telegram.org/js/telegram-widget.js?22",
                "data-telegram-login": telegramBotName,
                "data-userpic": "false",
                "data-request-access": "write",
                onload: `setTimeout(() => document.getElementById('telegram-login-${telegramBotName}')?.style.setProperty('display', 'none'))`,
              },
              injectTo: "body" as const,
            })
          }

          return {
            html,
            tags,
          }
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "127.0.0.1",
      port: 3000,
      proxy: {
        // Main Console API generated from scripts/swagger.yaml; routes start with /api/v1.
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          headers: apiProxyHeaders,
        },
        // Webhooks RT API generated from the webhooks swagger; client prefixes requests with /streaming-api.
        "/streaming-api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          headers: apiProxyHeaders,
        },
        // Airdrop API generated from the airdrop swagger; generated routes start directly with /v1.
        "/v1": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          headers: apiProxyHeaders,
        },
        // Legacy/new Airdrop service routes used by the old frontend under /airdrop-api/v2.
        "/airdrop-api": {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
          headers: apiProxyHeaders,
        },
      },
    },
  }
})

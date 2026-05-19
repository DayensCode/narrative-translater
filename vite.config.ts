import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [".localhost"],
    origin: "http://narrative.localhost:5173",
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: [".localhost"],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["vite.svg"],
      devOptions: {
        enabled: true,
        type: "module",
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/(huggingface\.co|cdn-lfs\.huggingface\.co|hf\.co)\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "hf-model-cache",
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cdn-assets-cache",
              expiration: {
                maxEntries: 64,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        id: "narrative",
        name: "Narrative",
        short_name: "Narrative",
        description: "Narrative: PWA для записи голоса, перевода и озвучки",
        theme_color: "#edf4ff",
        background_color: "#edf4ff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/vite.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});

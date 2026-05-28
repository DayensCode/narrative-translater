import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          i18n: ["i18next", "i18next-browser-languagedetector", "react-i18next"],
          icons: ["lucide-react"],
          // @huggingface/transformers is only used from workers, so it
          // doesn't need a main-thread chunk and would otherwise be empty.
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [".localhost"],
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    allowedHosts: [".localhost"],
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      devOptions: {
        enabled: false,
      },
      workbox: {
        inlineWorkboxRuntime: true,
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        navigationPreload: true,
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
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
            label: "Narrative",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "narrow",
            label: "Narrative",
          },
        ],
      },
    }),
  ],
});

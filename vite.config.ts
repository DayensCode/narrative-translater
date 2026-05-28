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
    // Loopback only. Binding to 0.0.0.0 on a shared Wi-Fi exposes an
    // in-progress session (microphone gated by origin, but UI state is not).
    // Override with `--host` explicitly when LAN/device testing is needed.
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    allowedHosts: [".localhost"],
  },
  preview: {
    host: "127.0.0.1",
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
      // Explicit opt-in: we prompt the user before replacing the installed SW
      // instead of silently auto-updating. A compromised build would otherwise
      // propagate to every installed client without any detection window.
      registerType: "prompt",
      includeAssets: [
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
      ],
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
            // Only cache successful CORS responses (status 200). Opaque
            // responses (status 0) could be silently-substituted by an
            // on-path attacker during first download — we'd rather fail
            // loudly and re-fetch than persist tampered model weights.
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
                statuses: [200],
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
                statuses: [200],
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
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        screenshots: [
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
            label: "Narrative",
          },
          {
            src: "/android-chrome-512x512.png",
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

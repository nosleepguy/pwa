import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "My PWA",
        short_name: "PWA",
        description: "My Progressive Web App",
        start_url: "/?mode=standalone",
        id: "my-pwa-id",
        background_color: "#ffffff",
        orientation: "portrait",
        theme_color: "#000000",
        display: "standalone",
        related_applications: [
          {
            platform: "webapp",
            url: "https://pwa-noti.vercel.app/manifest.json",
          },
        ],
        icons: [
          {
            src: "fox-icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});

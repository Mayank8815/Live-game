import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Leela Bazar",
        short_name: "Leela Bazar",
        description: "Leela Bazar",
        theme_color: "#ffcc80",
        background_color: "#ffcc80",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/Logo.png",
            sizes: "712x712",
            type: "image/png",
            purpose: "any",  
          },
          {
            src: "/Logo.png",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any",  
          },
        ],
      },
    }),
  ],
});
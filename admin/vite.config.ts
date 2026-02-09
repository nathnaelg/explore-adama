import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  server: {
    port: 4000,
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "::1",
      "imputedly-sixpenny-clarisa.ngrok-free.dev", // <-- add your ngrok host
    ],
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3005",
        changeOrigin: true,
        secure: false,
      },
      "/ml": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ml/, ""),
        secure: false,
      },
    },
  },
});

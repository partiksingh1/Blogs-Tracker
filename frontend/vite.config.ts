import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    host: "0.0.0.0", // Listen on all interfaces (required for Docker)
    port: 3000,       // Container port
    allowedHosts: ["blogzone.partik.online"], // ✅ Add your domain
  },
  server: {
    host: "0.0.0.0", // Allows hot reload if needed inside Docker
    port: 3000,
  },
});

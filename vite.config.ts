import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Only include Replit plugins if in Replit dev environment
const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  plugins: [
    react(),
    ...(isReplit ? [require("@replit/vite-plugin-runtime-error-modal")()] : []),
    ...(isReplit
      ? [require("@replit/vite-plugin-cartographer").cartographer()]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  base: "./", // relative asset paths
});

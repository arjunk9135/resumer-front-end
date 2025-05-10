import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async () => {
  const cartographerPlugin =
    process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
      ? [(await import("@replit/vite-plugin-cartographer")).cartographer()]
      : [];

  return {
    // No need to set root since the config file is already 
    // expected to be at the same level as index.html
    
    plugins: [react(), runtimeErrorOverlay(), ...cartographerPlugin],
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@shared": path.resolve(__dirname, "../shared"),
        "@assets": path.resolve(__dirname, "../attached_assets"),
      },
    },
    
    // Use relative paths for assets
    base: "./",
    
    build: {
      // Let Vite use its default output directory (dist in the same folder as index.html)
      emptyOutDir: true,
    },
    
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.json'],
  };
});
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
    // Root directory is set to the client folder
    root: path.resolve(__dirname, "client"),

    // Plugins to handle React, runtime error overlay, and Replit plugin (if not in production)
    plugins: [react(), runtimeErrorOverlay(), ...cartographerPlugin],

    // Resolve paths for aliases
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },

    // Set base path at the top level
    base: "./",

    // Build options
    build: {
      // Keep output inside client folder (default is 'dist' inside root)
      // This is the key change - we're not specifying outDir, letting it use the default
      
      // Ensure the output directory is cleaned before the build
      emptyOutDir: true,
    },

    // Add this to ensure all assets are included
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.json'],
  };
});
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// export default defineConfig(async () => {
//   const cartographerPlugin =
//     process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined
//       ? [(await import("@replit/vite-plugin-cartographer")).cartographer()]
//       : [];

//   return {
//     root: path.resolve(__dirname, "client"),
//     plugins: [react(), runtimeErrorOverlay(), ...cartographerPlugin],
//     resolve: {
//       alias: {
//         "@": path.resolve(__dirname, "client", "src"),
//         "@shared": path.resolve(__dirname, "shared"),
//         "@assets": path.resolve(__dirname, "attached_assets"),
//       },
//     },
//     build: {
//       outDir: path.resolve(__dirname, "dist"),
//       emptyOutDir: true,
//     },
//     base: "./", // for relative asset loading in Vercels
//   };
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  plugins: [react()], // Removed Replit-specific plugins
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  build: {
    outDir: path.resolve(__dirname, "dist/client"), // Standard output dir
    emptyOutDir: true,
    sourcemap: true
  },
  server: {
    port: parseInt(process.env.PORT || "3000")
  }
});

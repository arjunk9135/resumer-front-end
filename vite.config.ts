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


import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';
import fs from 'fs';

// 1. Custom plugin to remove Replit scripts and modify viewport
const cleanHtmlPlugin = (): Plugin => {
  return {
    name: 'clean-html',
    transformIndexHtml(html) {
      return html
        .replace(/<script src="https:\/\/replit\.com\/public\/js\/replit-dev-banner\.js"><\/script>/g, '')
        .replace(/,maximum-scale=1/g, '');
    },
    closeBundle() {
      const htmlPath = path.resolve(__dirname, 'dist/index.html');
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf8');
        html = html
          .replace(/<script src="https:\/\/replit\.com\/public\/js\/replit-dev-banner\.js"><\/script>/g, '')
          .replace(/,maximum-scale=1/g, '');
        fs.writeFileSync(htmlPath, html);
      }
    }
  };
};

// 2. Main Vite configuration
export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  plugins: [
    react(),
    cleanHtmlPlugin(), // Our custom cleaning plugin
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: 'Resumer App',
          description: 'Professional Resume Builder'
        }
      },
      template: 'index.html' // Explicit template path
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets')
    }
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  base: '/',
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  preview: {
    port: 3000,
    strictPort: true
  }
});
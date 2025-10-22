import { defineConfig } from 'vite';
import path from 'path';

// Try to import React plugin, fall back to basic config if not available
let react;
try {
  react = require('@vitejs/plugin-react').default;
} catch (e) {
  console.warn('React plugin not found, trying alternative...');
  try {
    react = require('@vitejs/plugin-react-swc').default;
  } catch (e2) {
    console.warn('No React plugin found, using esbuild jsx');
    react = () => ({});
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
  ],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode === 'development',
    minify: mode === 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    }
  },
  server: {
    port: 5174,
    host: true,
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    } : undefined
  },
  preview: {
    port: 4173,
    host: true
  }
}));


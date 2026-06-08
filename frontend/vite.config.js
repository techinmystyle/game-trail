import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },

  // Pre-bundle only what's needed at initial load — Three.js is lazy-loaded
  // so it doesn't need to be in the pre-bundle for fast cold start
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Explicitly exclude heavy deps so they're tree-shaken per-chunk
    exclude: [],
  },

  build: {
    // Use esbuild for minification (default, very fast)
    minify: 'esbuild',
    // Increase the warning threshold slightly (Three.js chunks are large by design)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Three.js — only downloaded when Dashboard route loads
          if (id.includes('node_modules/three')) return 'three';
          // Framer Motion — only downloaded when needed
          if (id.includes('node_modules/framer-motion')) return 'framer-motion';
          // Socket.io — only downloaded for computer-mode routes
          if (id.includes('node_modules/socket.io-client') || id.includes('node_modules/engine.io-client')) return 'socket-io';
          // Lucide icons — shared across many components
          if (id.includes('node_modules/lucide-react')) return 'lucide';
          // React core — always needed
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) return 'react-core';
          // React Router
          if (id.includes('node_modules/react-router')) return 'react-router';
        },
      },
    },
  },
})

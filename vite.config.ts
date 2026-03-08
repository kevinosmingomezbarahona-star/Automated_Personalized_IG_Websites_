import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Raise the chunk-size warning threshold slightly (Spline + framer-motion are large)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor dependencies into separate cached chunks.
        // This prevents a single massive JS bundle from blocking the browser
        // parser before any React component can render.
        manualChunks: {
          // React core — never changes, cached forever
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Animation library — large but static
          'vendor-framer': ['framer-motion'],
          // Supabase client — only needed after data fetch
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
});

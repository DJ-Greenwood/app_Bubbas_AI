import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    // Generate clean CSS files
    cssCodeSplit: true,
    // Set to empty string to avoid adding hash to filenames
    // or set to 'hash' for adding content hash to asset filenames
    assetsInlineLimit: 4096, // 4kb
    chunkSizeWarningLimit: 500, // in kBs
  },
  // Add environment variables loading configuration if needed
  envPrefix: 'VITE_'
})

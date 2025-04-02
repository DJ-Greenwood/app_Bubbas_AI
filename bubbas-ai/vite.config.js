import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Don't use react().tailwindcss - these are separate plugins
export default defineConfig({
  plugins: [react()],
})

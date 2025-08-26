// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite' // REMOVA ESTA LINHA

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // tailwindcss() // REMOVA ESTA LINHA DO ARRAY DE PLUGINS
  ],
})
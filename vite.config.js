import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default {
  plugins: [react()],
  server: {
    // Ignore IDE / editor directories and local env files to prevent noisy restarts
    // (Vite watches env files by default and will restart on changes)
    watch: {
      ignored: ['**/.vs/**', '**/.git/**', '**/node_modules/**', '**/.env', '**/.env.*']
    }
  }
}

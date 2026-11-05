import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: proxy API calls to the Spring Boot backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward all /api requests to Spring Boot on port 8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})

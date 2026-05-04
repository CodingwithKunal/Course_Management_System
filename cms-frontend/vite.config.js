import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    open: true,
    // proxy: {
    //   '/api': 'http://localhost:5000', // Note: Adjust the backend URL and port as needed
    // },
    cors: true,
  }
})

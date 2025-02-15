import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server URL
        changeOrigin: true, // Corrected typo
        secure: false, // Add this line if your backend is not using HTTPS during development
      },
    },
  },
});

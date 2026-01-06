import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor";
            if (id.includes("framer-motion") || id.includes("lucide-react"))
              return "ui";
            if (id.includes("@supabase")) return "supabase";
            return "vendor";
          }
        },
      },
    },
  },
});

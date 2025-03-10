import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://indexer.passage-apis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/v1"),
      },
      "/s3": {
        target: "https://passage.s3.us-east-2.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3/, ""),
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // json-server가 db.json에 쓸 때마다 Vite가 페이지를 새로고침하지 않도록 감시에서 제외
    watch: { ignored: ["**/db.json"] },
  },
});

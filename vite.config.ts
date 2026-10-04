import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    // relative asset paths so the build loads from NW.js's app root
    base: "./",
    plugins: [react()],
    build: {
        outDir: "www",
        emptyOutDir: true,
    },
    server: {
        port: 9000,
    },
});

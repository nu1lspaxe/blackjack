import { resolve } from "path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
    base: 'blackjack',

    server: {
        host: true
    },

    resolve: {
        alias: {
            "@": resolve("./src"),
            "@components": resolve("./src/components"),
            "@screens": resolve("./src/screens"),
            "@utils": resolve("./src/utils"),
        }
    },

    plugins: [react(), svgr()],
});

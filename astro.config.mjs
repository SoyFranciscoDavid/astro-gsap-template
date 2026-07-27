import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  integrations: [icon()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, "./src/components"),
        "@layouts": path.resolve(__dirname, "./src/layouts"),
        "@assets": path.resolve(__dirname, "./src/assets"),
        "@styles": path.resolve(__dirname, "./src/styles"),
        "@scripts": path.resolve(__dirname, "./src/scripts"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@data": path.resolve(__dirname, "./src/data"),
        "@services": path.resolve(__dirname, "./src/services"),
      },
    },
  },
});

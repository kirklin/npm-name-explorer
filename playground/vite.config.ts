import { resolve } from "node:path";
import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import Vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";
import Inspect from "vite-plugin-inspect";
import VueDevTools from "vite-plugin-vue-devtools";

// vite.config.ts
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import UnoCss from "unocss/vite";
import { updateEnvVariables } from "./updateEnvVariables";
import { configureProxy } from "./configureViteProxy";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = updateEnvVariables(env);
  const {
    VITE_PROXY,
  } = viteEnv;
  const pathResolve = (pathname: string) => resolve(root, ".", pathname);
  console.warn(VITE_PROXY, "VITE_PROXY");
  return {
    server: {
      host: "localhost",
      port: 8888,
      open: true,
      https: false,
      proxy: configureProxy(VITE_PROXY),
    },
    plugins: [
      Vue(
        {
          script: {
            propsDestructure: true,
            defineModel: true,
          },
        },
      ),
      Icons({
        scale: 1.5, // Scale of icons against 1em
        defaultStyle: "", // Style apply to icons
        defaultClass: "inline-block h-5 w-5 stroke-current md:h-6 md:w-6", // Class names apply to icons
        compiler: "vue3", // "vue2", "vue3", "jsx"
        jsx: "react", // "react" or "preact"
        autoInstall: true,
      }),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "vue-i18n",
          "vue/macros",
          "@vueuse/head",
          "@vueuse/core",
        ],
        dts: "types/auto-imports.d.ts",
        dirs: [
          "src/composables",
          "src/store",
        ],
        vueTemplate: true,
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        extensions: ["vue"],
        include: [/\.vue$/, /\.vue\?vue/],
        dts: "types/components.d.ts",
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
        resolvers: [
          IconsResolver(),
        ],
      }),

      // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        fullInstall: true,
        include: [resolve(__dirname, "src/locales/**")],
      }),

      // https://github.com/antfu/vite-plugin-inspect
      // Visit http://localhost:3333/__inspect/ to see the inspector
      Inspect(),

      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),

      // https://github.com/unocss/unocss
      // see unocss.config.ts for config
      UnoCss(),
    ],
    resolve: {
      alias: {
        "~/": `${pathResolve("src")}/`,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
      @import "~/styles/variables.scss";
    `,
          javascriptEnabled: true,
        },
      },
    },
    // https://github.com/vitest-dev/vitest
    test: {
      environment: "jsdom",
    },
  };
});

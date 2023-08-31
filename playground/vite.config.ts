import { resolve } from "node:path";
import type { ProxyOptions } from "vite";
import { defineConfig } from "vite";
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

function configureProxy(proxyList: [string, string][] = []) {
  // 创建一个空的代理对象
  // Create an empty proxy object
  const proxyConfig: Record<string, ProxyOptions> = {};
  // 遍历代理列表中的每一对前缀和目标地址
  // Iterate over each pair of prefix and target address in the proxy list
  for (const [prefix, target] of proxyList) {
    // 判断目标地址是否是https协议
    // Determine if the target address is https protocol
    const isHttps = /^https:\/\//.test(target);
    // 根据前缀和目标地址设置代理选项，参考https://github.com/http-party/node-http-proxy#options
    // Set proxy options according to prefix and target address, refer to https://github.com/http-party/node-http-proxy#options
    proxyConfig[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      // 使用正则表达式替换路径中的前缀为空字符串，实现重写路径的功能
      // Use regular expression to replace the prefix in the path with an empty string, to achieve the function of rewriting the path
      rewrite: (path: string) => path.replace(new RegExp(`^${prefix}`), ""),
      // 如果目标地址是https协议，需要设置secure为false，否则不需要设置该选项
      // If the target address is https protocol, need to set secure to false, otherwise do not need to set this option
      ...(isHttps ? { secure: false } : {}),
    };
  }
  // 返回代理对象
  // Return the proxy object
  return proxyConfig;
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    port: 8888,
    open: true,
    https: false,
    proxy: configureProxy([["/api", "https://npm-name-explorer-api.vercel.app"]]),
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
      "~/": `${resolve(__dirname, "src")}/`,
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
});

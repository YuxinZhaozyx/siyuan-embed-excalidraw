/* eslint-disable node/prefer-global/process */
import { resolve } from "node:path"
import minimist from "minimist"
import {
  defineConfig,
  loadEnv,
} from "vite"
import { viteStaticCopy } from "vite-plugin-static-copy"

const pluginInfo = require("./plugin.json")

export default defineConfig(({
  mode,
}) => {

  console.log('mode=>', mode)
  const env = loadEnv(mode, process.cwd())
  const {
    VITE_SIYUAN_WORKSPACE_PATH,
  } = env
  console.log('env=>', env)


  const siyuanWorkspacePath = VITE_SIYUAN_WORKSPACE_PATH
  let devDistDir = './dev'
  if (!siyuanWorkspacePath) {
    console.log("\nSiyuan workspace path is not set.")
  } else {
    console.log(`\nSiyuan workspace path is set:\n${siyuanWorkspacePath}`)
    devDistDir = `${siyuanWorkspacePath}/data/plugins/${pluginInfo.name}`
  }
  console.log(`\nPlugin will build to:\n${devDistDir}`)

  const args = minimist(process.argv.slice(2))
  const isWatch = args.watch || args.w || false
  const distDir = (isWatch || mode === "development") ? devDistDir : "./dist"

  console.log()
  console.log("isWatch=>", isWatch)
  console.log("distDir=>", distDir)

  return {
    root: resolve(__dirname, "app"),
    base: "./",
    
    resolve: {
      alias: {
        "@": resolve(__dirname, "app"),
      },
    },

    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: "../node_modules/@excalidraw/excalidraw/dist/prod/fonts/",
            dest: "./",
          },
        ],
      }),
    ],

    // https://github.com/vitejs/vite/issues/1930
    // https://vitejs.dev/guide/env-and-mode.html#env-files
    // https://github.com/vitejs/vite/discussions/3058#discussioncomment-2115319
    // 在这里自定义变量
    define: {
      "process.env.DEV_MODE": `"${isWatch}"`,
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },

    build: {
      // 输出路径
      outDir: resolve(__dirname, distDir, 'app'),
      emptyOutDir: !isWatch,

      // 构建后是否生成 source map 文件
      sourcemap: false,

      // 设置为 false 可以禁用最小化混淆
      // 或是用来指定是应用哪种混淆器
      // boolean | 'terser' | 'esbuild'
      // 不压缩，用于调试
      minify: !isWatch,

      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["siyuan", "process"],

        output: {
          assetFileNames(chunkInfo) {
            if (chunkInfo?.name?.endsWith(".woff2")) {
              const family = chunkInfo.name.split("-")[0];
              return `fonts/${family}/[name][extname]`;
            }

            return "assets/[name]-[hash][extname]";
          },
        }
      },
    },
  }
})

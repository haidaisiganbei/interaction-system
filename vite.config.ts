import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    // 自动生成类型声明文件
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts']
    })
  ],
  build: {
    lib: {
      // 入口文件
      entry: resolve(__dirname, 'src/index.ts'),
      // 库名称
      name: 'InteractionSystem',
      // 输出文件名格式
      fileName: (format) => `index.${format}.js`,
      // 支持的格式：ES 模块和 CommonJS
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // 外部化依赖，不打包进库中
      external: ['buffer'],
      output: {
        // 为外部依赖提供全局变量名
        globals: {
          buffer: 'Buffer'
        }
      }
    },
    // 生成 sourcemap
    sourcemap: true,
    // 输出目录
    outDir: 'dist',
    // 清空输出目录
    emptyOutDir: true,
    // 压缩代码
    minify: false, // 库模式通常不压缩，让使用者自己决定
    // 目标环境
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});


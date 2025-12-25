import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    // 配置开发服务器
    server: {
        port: 3000,
        open: true
    },

    // 配置资源处理
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],

    // 配置模块解析
    // resolve: {
    //     alias: {
    //         // 指向本地的 interaction-system 包
    //         'interaction-system': path.resolve(__dirname, '../../src')
    //     }
    // },

    // 构建配置
    build: {
        outDir: 'dist',
        sourcemap: true
    }
});


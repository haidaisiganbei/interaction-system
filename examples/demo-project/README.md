# Interaction System Demo Project

这是一个使用 `interaction-system` 库的完整示例项目。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 3. 构建生产版本

```bash
npm run build
```

构建输出在 `dist/` 目录。

## 项目结构

```
demo-project/
├── src/
│   └── main.ts          # 主应用代码
├── index.html           # HTML 入口文件
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
├── package.json         # 项目配置
└── README.md           # 本文档
```

## 功能演示

### 触摸/鼠标交互
- 在画布上点击、拖动
- 查看实时坐标和消息日志

### 滚动事件
- 使用鼠标滚轮
- 观察滚动消息

### 多点触控
- 按住 `Ctrl` 键
- 移动鼠标模拟双指操作

### 键盘输入
- 按任意键
- 查看键码映射

## Vite 配置说明

### 资源处理

```typescript
assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif']
```

这确保图片资源被正确处理。

### 模块别名

```typescript
resolve: {
    alias: {
        'interaction-system': path.resolve(__dirname, '../../src')
    }
}
```

直接引用源码，无需编译。也可以改为：

```typescript
'interaction-system': path.resolve(__dirname, '../../dist')
```

使用编译后的版本。

## 自定义开发

### 修改屏幕尺寸

在 `src/main.ts` 中修改：

```typescript
const screenInfo = new ScreenInfo(
    new Rect(0, 0, 1080, 1920),  // 改为你的尺寸
    new Size(1080, 1920),
    0
);
```

### 添加自定义处理

在消息监听器中添加逻辑：

```typescript
const listener: InteractionHandlerListener = {
    sendMessage: (message: ControlMessage) => {
        // 你的自定义处理
        if (message instanceof TouchControlMessage) {
            // 处理触摸消息
        }
    }
};
```

### 连接到实际服务器

替换 `sendMessage` 中的逻辑：

```typescript
sendMessage: (message: ControlMessage) => {
    const buffer = message.toBuffer();
    websocket.send(buffer);  // 发送到你的 WebSocket 服务器
}
```

## 常见问题

### Q: 为什么图片资源加载失败？

A: Vite 配置已包含图片处理。如果仍有问题，检查：
1. `assetsInclude` 配置是否正确
2. 图片路径是否正确
3. 是否运行了 `npm install`

### Q: 如何调试？

A: 
1. 打开浏览器开发者工具
2. 查看 Console 标签
3. 所有消息都会在日志中显示

### Q: 如何使用编译后的版本？

A: 修改 `vite.config.ts`:

```typescript
alias: {
    'interaction-system': path.resolve(__dirname, '../../dist')
}
```

然后在 interaction-system 目录运行 `npm run build`。

## 更多资源

- [interaction-system README](../../README.md)
- [详细使用指南](../../USAGE.md)
- [GitHub 仓库](https://github.com/NetrisTV/ws-scrcpy)


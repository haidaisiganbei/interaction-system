# npm link 使用指南

本文档说明如何使用 `npm link` 在本地开发和测试 interaction-system 包。

## 什么是 npm link？

`npm link` 创建一个全局符号链接，允许你在其他项目中像使用已发布的 npm 包一样使用本地包。这对于开发和测试非常有用。

## 使用步骤

### 1. 在 interaction-system 中创建全局链接

```bash
cd D:\code\wuin\ws-scrcpy\interaction-system
npm link
```

**输出示例：**
```
added 1 package, and audited X packages in Xs
found 0 vulnerabilities
```

这会在全局 node_modules 中创建一个指向当前目录的符号链接。

### 2. 在目标项目中使用链接

有两种方式：

#### 方式 A: 使用 npm link（推荐用于开发）

```bash
cd your-project
npm link interaction-system
```

#### 方式 B: 使用 file: 协议（推荐用于稳定使用）

在项目的 `package.json` 中：

```json
{
  "dependencies": {
    "interaction-system": "file:../ws-scrcpy/interaction-system"
  }
}
```

然后运行：
```bash
npm install
```

### 3. 验证链接

在目标项目中：

```bash
npm list interaction-system
```

应该显示链接的路径。

### 4. 使用包

在代码中正常导入：

```typescript
import { FeaturedInteractionHandler } from 'interaction-system';
```

## 示例项目测试

### 测试 demo-project

```bash
# 1. 创建全局链接
cd D:\code\wuin\ws-scrcpy\interaction-system
npm link

# 2. 在示例项目中链接（如果使用 npm link 方式）
cd examples\demo-project
npm install
npm link interaction-system

# 3. 启动开发服务器
npm run dev
```

**注意：** demo-project 已配置使用 `file:../..` 协议，所以实际上不需要 `npm link`，直接 `npm install` 即可。

## 取消链接

### 在目标项目中取消链接

```bash
cd your-project
npm unlink interaction-system
npm install  # 重新安装正常版本
```

### 删除全局链接

```bash
cd D:\code\wuin\ws-scrcpy\interaction-system
npm unlink
```

或者直接：

```bash
npm unlink -g interaction-system
```

## 常见问题

### Q: npm link 后导入失败？

A: 确保：
1. interaction-system 已编译（运行 `npm run build`）
2. package.json 的 `main` 和 `types` 字段正确
3. 目标项目的 TypeScript 配置正确

### Q: 修改源码后不生效？

A: 
- 如果使用编译后的版本（`dist/`），需要重新运行 `npm run build`
- 如果直接引用源码，确保构建工具配置了 TypeScript 编译

### Q: npm link 和 file: 协议有什么区别？

A: 
- **npm link**: 创建符号链接，修改立即生效（如果使用源码）
- **file:**: 复制文件，需要重新 `npm install` 才能更新

### Q: 在 demo-project 中应该用哪种方式？

A: demo-project 使用 Vite 的 alias 配置直接引用源码：

```typescript
// vite.config.ts
alias: {
    'interaction-system': path.resolve(__dirname, '../../src')
}
```

这样修改源码后无需重新编译或链接，Vite 会自动重新编译。

## 推荐工作流

### 开发 interaction-system 本身

```bash
cd interaction-system
npm run watch  # 监听文件变化自动编译
```

在另一个终端：

```bash
cd examples/demo-project
npm run dev    # 启动开发服务器
```

修改源码后，demo-project 会自动热重载。

### 在其他项目中使用

**开发阶段：**
```bash
# 使用 npm link 或 file: 协议
npm link interaction-system
```

**生产阶段：**
```json
{
  "dependencies": {
    "interaction-system": "^1.0.0"  // 使用已发布的版本
  }
}
```

## 验证清单

- [x] `npm link` 成功创建全局链接
- [x] package.json 配置完整（main, types, exports）
- [x] dist/ 目录包含编译后的文件
- [x] .npmignore 正确排除不需要的文件
- [x] demo-project 可以正常导入和使用
- [x] TypeScript 类型定义正常工作

## 下一步

1. 在 demo-project 中测试所有功能
2. 在实际项目中集成测试
3. 准备发布到 npm（如果需要）

## 相关文档

- [README.md](README.md) - 项目概览
- [USAGE.md](USAGE.md) - 详细使用指南
- [examples/demo-project/README.md](examples/demo-project/README.md) - 示例项目说明


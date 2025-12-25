# Interaction System

独立的用户交互处理和控制消息生成库，从 ws-scrcpy 项目中提取。

## 简介

这是一个完全独立的交互处理库，包含从用户交互（触摸、鼠标、键盘）到生成控制消息的完整流程。它提供了一套完整的解决方案，用于捕获浏览器中的用户输入并将其转换为结构化的控制消息。

## 特性

- **多种交互处理器**：支持功能完整的交互处理器和简化版交互处理器
- **完整的控制消息**：支持触摸、滚动、键盘、文本输入、命令等多种消息类型
- **键盘映射**：完整的浏览器键码到 Android 键码的映射
- **多点触控支持**：支持模拟多点触控手势
- **类型安全**：完全使用 TypeScript 编写，提供完整的类型定义
- **零依赖核心**：核心功能无外部依赖（仅依赖 buffer 包）

## 安装

### 从 npm 安装（公开发布后）

```bash
npm install interaction-system
```

### 本地使用

如果你想在本地项目中使用此包，有以下几种方式：

#### 方法 1: npm link（推荐用于开发）

这种方式创建全局符号链接，适合频繁修改和测试：

```bash
# 在 interaction-system 目录中
cd interaction-system
npm link

# 在你的项目中
cd your-project
npm link interaction-system
```

之后可以像正常的 npm 包一样导入使用：

```typescript
import { FeaturedInteractionHandler } from 'interaction-system';
```

**取消链接：**
```bash
# 在你的项目中
npm unlink interaction-system

# 在 interaction-system 目录中（可选）
npm unlink
```

#### 方法 2: 相对路径安装

直接从本地文件系统安装：

```bash
cd your-project
npm install ../path/to/ws-scrcpy/interaction-system
```

#### 方法 3: file: 协议

在项目的 `package.json` 中添加依赖：

```json
{
  "dependencies": {
    "interaction-system": "file:../ws-scrcpy/interaction-system"
  }
}
```

然后运行 `npm install`。

#### 方法 4: 直接引用源码

如果在同一个 monorepo 中，可以直接引用 TypeScript 源码：

```typescript
import { FeaturedInteractionHandler } from '../../interaction-system/src';
```

**注意事项：**
- 使用 `npm link` 时，包的更新会立即反映到所有链接的项目中
- 使用 `file:` 协议时，需要重新运行 `npm install` 才能获取更新
- 直接引用源码需要项目的构建工具能够处理 TypeScript

## 基本使用

### 1. 实现 IPlayer 接口

首先，你需要实现 `IPlayer` 接口：

```typescript
import { IPlayer, ScreenInfo } from 'interaction-system';

class MyPlayer implements IPlayer {
    private canvas: HTMLCanvasElement;
    private screenInfo?: ScreenInfo;

    constructor() {
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
    }

    getTouchableElement(): HTMLCanvasElement {
        return this.canvas;
    }

    getScreenInfo(): ScreenInfo | undefined {
        return this.screenInfo;
    }

    setScreenInfo(info: ScreenInfo) {
        this.screenInfo = info;
    }
}
```

### 2. 使用 FeaturedInteractionHandler

完整功能的交互处理器，支持触摸、鼠标、滚动和键盘输入：

```typescript
import { 
    FeaturedInteractionHandler, 
    InteractionHandlerListener,
    ControlMessage,
    ScreenInfo,
    Rect,
    Size
} from 'interaction-system';

// 创建播放器实例
const player = new MyPlayer();

// 设置屏幕信息
const screenInfo = new ScreenInfo(
    new Rect(0, 0, 1080, 1920),
    new Size(1080, 1920),
    0
);
player.setScreenInfo(screenInfo);

// 实现监听器
const listener: InteractionHandlerListener = {
    sendMessage: (message: ControlMessage) => {
        // 处理控制消息
        console.log('Received message:', message);
        const buffer = message.toBuffer();
        // 发送 buffer 到服务器
    }
};

// 创建交互处理器
const handler = new FeaturedInteractionHandler(player, listener);

// 当不再需要时，释放资源
// handler.release();
```

### 3. 使用 SimpleInteractionHandler

简化版交互处理器，仅支持点击和滚动：

```typescript
import { 
    SimpleInteractionHandler, 
    TouchHandlerListener,
    Position 
} from 'interaction-system';

const listener: TouchHandlerListener = {
    performClick: (position: Position) => {
        console.log('Click at:', position);
    },
    performScroll: (from: Position, to: Position) => {
        console.log('Scroll from:', from, 'to:', to);
    }
};

const simpleHandler = new SimpleInteractionHandler(player, listener);
```

### 4. 键盘输入处理

独立的键盘输入处理器：

```typescript
import { KeyInputHandler, KeyEventListener, KeyCodeControlMessage } from 'interaction-system';

const keyListener: KeyEventListener = {
    onKeyEvent: (event: KeyCodeControlMessage) => {
        console.log('Key event:', event);
        const buffer = event.toBuffer();
        // 发送到服务器
    }
};

// 添加监听器
KeyInputHandler.addEventListener(keyListener);

// 移除监听器
// KeyInputHandler.removeEventListener(keyListener);
```

### 5. 手动创建控制消息

你也可以手动创建和发送控制消息：

```typescript
import {
    TouchControlMessage,
    ScrollControlMessage,
    TextControlMessage,
    CommandControlMessage,
    Position,
    Point,
    Size,
    MotionEvent
} from 'interaction-system';

// 触摸消息
const touchMsg = new TouchControlMessage(
    MotionEvent.ACTION_DOWN,  // 动作类型
    0,                         // 指针 ID
    new Position(
        new Point(100, 200),   // 触摸点
        new Size(1080, 1920)   // 屏幕尺寸
    ),
    1.0,                       // 压力值
    MotionEvent.BUTTON_PRIMARY // 按钮
);

// 滚动消息
const scrollMsg = new ScrollControlMessage(
    new Position(new Point(540, 960), new Size(1080, 1920)),
    0,   // 水平滚动
    -1   // 垂直滚动
);

// 文本消息
const textMsg = new TextControlMessage('Hello World');

// 命令消息
const clipboardMsg = CommandControlMessage.createSetClipboardCommand('复制的文本', false);

// 转换为 Buffer
const buffer = touchMsg.toBuffer();
```

## API 文档

### 核心接口

#### IPlayer

播放器接口，需要由使用方实现：

```typescript
interface IPlayer {
    getTouchableElement(): HTMLCanvasElement;
    getScreenInfo(): ScreenInfo | undefined;
}
```

### 交互处理器

#### InteractionHandler (抽象类)

基础交互处理器，提供了通用的交互处理逻辑。

#### FeaturedInteractionHandler

完整功能的交互处理器，支持：
- 触摸事件
- 鼠标事件
- 滚轮滚动
- 键盘输入
- 多点触控（Ctrl + 鼠标）

#### SimpleInteractionHandler

简化版交互处理器，仅支持：
- 点击
- 拖动滚动

### 控制消息

所有控制消息都继承自 `ControlMessage` 基类，并实现了 `toBuffer()` 方法用于序列化。

- `TouchControlMessage` - 触摸事件
- `ScrollControlMessage` - 滚动事件
- `KeyCodeControlMessage` - 键盘按键
- `TextControlMessage` - 文本输入
- `CommandControlMessage` - 系统命令（剪贴板、电源等）

### 数据模型

- `Point` - 二维点坐标
- `Size` - 尺寸（宽度和高度）
- `Position` - 位置（点 + 屏幕尺寸）
- `Rect` - 矩形区域
- `ScreenInfo` - 屏幕信息
- `MotionEvent` - 运动事件常量

## 高级用法

### 多点触控

使用 `FeaturedInteractionHandler` 时，按住 `Ctrl` 键可以激活多点触控模式：

- `Ctrl + 鼠标移动` - 创建对称的两个触摸点
- `Ctrl + Shift + 鼠标` - 以第一个点为中心创建镜像触摸点

### 自定义命令

```typescript
import { CommandControlMessage, ControlMessage } from 'interaction-system';

// 设置剪贴板
const clipboardCmd = CommandControlMessage.createSetClipboardCommand('文本内容', false);

// 设置屏幕电源模式
const powerCmd = CommandControlMessage.createSetScreenPowerModeCommand(true);

// 创建简单命令
const expandNotifications = new CommandControlMessage(ControlMessage.TYPE_EXPAND_NOTIFICATION_PANEL);
```

## 架构说明

```
interaction-system/
├── src/
│   ├── interaction/      # 交互处理器
│   ├── messages/         # 控制消息
│   ├── input/            # 键盘输入处理
│   ├── models/           # 数据模型
│   ├── utils/            # 工具函数
│   ├── types/            # TypeScript 接口
│   └── assets/           # 静态资源（图片等）
```

## 注意事项

1. **ScreenInfo 是必需的**：大多数交互功能都需要正确的 `ScreenInfo`，确保在使用前设置。

2. **内存管理**：使用完交互处理器后调用 `release()` 方法释放资源。

3. **Buffer 依赖**：控制消息序列化依赖 Node.js 的 `Buffer` API（通过 buffer 包提供浏览器支持）。

4. **图片资源**：多点触控可视化需要加载图片资源，确保构建工具正确处理 PNG 导入。

## TypeScript 支持

本库完全使用 TypeScript 编写，提供完整的类型定义。无需额外安装 @types 包。

## 许可证

本项目采用 Apache-2.0 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 相关项目

- [ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy) - 原始项目


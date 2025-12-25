# Interaction System 使用指南

本文档提供 interaction-system 库的详细使用说明和最佳实践。

## 目录

- [快速开始](#快速开始)
- [核心概念](#核心概念)
- [完整示例](#完整示例)
- [构建工具配置](#构建工具配置)
- [API 参考](#api-参考)
- [常见问题](#常见问题)

## 快速开始

### 1. 安装依赖

```bash
# 如果使用 npm link
cd interaction-system && npm link
cd your-project && npm link interaction-system

# 或者使用 file: 协议
npm install file:../path/to/interaction-system
```

### 2. 基本设置

```typescript
import {
    FeaturedInteractionHandler,
    InteractionHandlerListener,
    ControlMessage,
    ScreenInfo,
    Rect,
    Size,
    IPlayer
} from 'interaction-system';

// 实现 IPlayer 接口
class VideoPlayer implements IPlayer {
    private canvas: HTMLCanvasElement;
    private screenInfo?: ScreenInfo;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
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

// 创建 canvas 元素
const canvas = document.createElement('canvas');
canvas.width = 360;
canvas.height = 640;
document.body.appendChild(canvas);

// 初始化播放器
const player = new VideoPlayer(canvas);

// 设置屏幕信息
const screenInfo = new ScreenInfo(
    new Rect(0, 0, 1080, 1920),
    new Size(1080, 1920),
    0
);
player.setScreenInfo(screenInfo);

// 创建消息监听器
const listener: InteractionHandlerListener = {
    sendMessage: (message: ControlMessage) => {
        console.log('控制消息:', message.toString());
        const buffer = message.toBuffer();
        // 发送到服务器
        // websocket.send(buffer);
    }
};

// 创建交互处理器
const handler = new FeaturedInteractionHandler(player, listener);

// 清理（当不再需要时）
// handler.release();
```

## 核心概念

### IPlayer 接口

`IPlayer` 是交互系统的核心接口，定义了与播放器交互的契约：

```typescript
interface IPlayer {
    // 获取用于捕获交互事件的 canvas 元素
    getTouchableElement(): HTMLCanvasElement;
    
    // 获取当前屏幕信息（用于坐标转换）
    getScreenInfo(): ScreenInfo | undefined;
}
```

### ScreenInfo

屏幕信息用于将浏览器坐标转换为设备坐标：

```typescript
const screenInfo = new ScreenInfo(
    new Rect(0, 0, 1080, 1920),  // 内容区域
    new Size(1080, 1920),         // 视频尺寸
    0                              // 设备旋转（0, 1, 2, 3）
);
```

### 控制消息

所有交互都会转换为控制消息：

- **TouchControlMessage** - 触摸事件
- **ScrollControlMessage** - 滚动事件
- **KeyCodeControlMessage** - 键盘按键
- **TextControlMessage** - 文本输入
- **CommandControlMessage** - 系统命令

## 完整示例

### 示例 1: 基础触摸交互

```typescript
import {
    FeaturedInteractionHandler,
    TouchControlMessage,
    MotionEvent
} from 'interaction-system';

// ... 设置 player 和 listener ...

const handler = new FeaturedInteractionHandler(player, {
    sendMessage: (message) => {
        if (message instanceof TouchControlMessage) {
            const { action, pointerId, position } = message;
            console.log(`触摸事件: ${
                action === MotionEvent.ACTION_DOWN ? '按下' :
                action === MotionEvent.ACTION_UP ? '抬起' : '移动'
            } at (${position.point.x}, ${position.point.y})`);
        }
        // 发送到服务器
    }
});
```

### 示例 2: 键盘输入

```typescript
import { KeyInputHandler, KeyEventListener } from 'interaction-system';

const keyListener: KeyEventListener = {
    onKeyEvent: (event) => {
        console.log(`键码: ${event.keycode}, 动作: ${event.action}`);
        const buffer = event.toBuffer();
        // websocket.send(buffer);
    }
};

// 注册全局键盘监听
KeyInputHandler.addEventListener(keyListener);

// 移除监听（清理时）
// KeyInputHandler.removeEventListener(keyListener);
```

### 示例 3: 简化版交互处理器

```typescript
import {
    SimpleInteractionHandler,
    TouchHandlerListener,
    Position
} from 'interaction-system';

const listener: TouchHandlerListener = {
    performClick: (position: Position) => {
        console.log(`点击位置: (${position.point.x}, ${position.point.y})`);
    },
    performScroll: (from: Position, to: Position) => {
        console.log(`滚动: 从 (${from.point.x}, ${from.point.y}) 到 (${to.point.x}, ${to.point.y})`);
    }
};

const simpleHandler = new SimpleInteractionHandler(player, listener);
```

### 示例 4: 手动创建控制消息

```typescript
import {
    TouchControlMessage,
    Position,
    Point,
    Size,
    MotionEvent
} from 'interaction-system';

// 模拟触摸按下
function simulateTouch(x: number, y: number) {
    const message = new TouchControlMessage(
        MotionEvent.ACTION_DOWN,
        0,  // 指针 ID
        new Position(
            new Point(x, y),
            new Size(1080, 1920)
        ),
        1.0,  // 压力值
        MotionEvent.BUTTON_PRIMARY
    );
    
    const buffer = message.toBuffer();
    return buffer;
}

// 发送到服务器
const touchBuffer = simulateTouch(540, 960);
```

## 构建工具配置

### Vite 配置

如果遇到 PNG 图片导入错误，配置 `vite.config.ts`：

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
    assetsInclude: ['**/*.png'],
    resolve: {
        alias: {
            'interaction-system': require.resolve('interaction-system')
        }
    }
});
```

### Webpack 配置

在 `webpack.config.js` 中：

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};
```

### TypeScript 配置

确保 `tsconfig.json` 包含：

```json
{
    "compilerOptions": {
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "moduleResolution": "node",
        "resolveJsonModule": true
    }
}
```

## API 参考

### 交互处理器

#### FeaturedInteractionHandler

完整功能的交互处理器。

**构造函数:**
```typescript
constructor(player: IPlayer, listener: InteractionHandlerListener)
```

**支持的事件:**
- 鼠标点击、移动、抬起
- 触摸开始、移动、结束
- 鼠标滚轮
- 键盘按键
- 多点触控（Ctrl + 鼠标）

**多点触控:**
- `Ctrl + 鼠标移动` - 创建对称的两个触摸点
- `Ctrl + Shift + 鼠标` - 以首次点击为中心创建镜像触摸点

#### SimpleInteractionHandler

简化版交互处理器。

**构造函数:**
```typescript
constructor(player: IPlayer, listener: TouchHandlerListener)
```

**支持的操作:**
- 点击（短距离拖动）
- 滚动（长距离拖动）

### 键盘处理

#### KeyInputHandler

全局键盘事件处理器。

**方法:**
```typescript
// 添加监听器
static addEventListener(listener: KeyEventListener): void

// 移除监听器
static removeEventListener(listener: KeyEventListener): void
```

### 数据模型

#### Point
```typescript
class Point {
    constructor(x: number, y: number)
    x: number
    y: number
    distance(to: Point): number
}
```

#### Size
```typescript
class Size {
    constructor(width: number, height: number)
    width: number
    height: number
    rotate(): Size
}
```

#### Position
```typescript
class Position {
    constructor(point: Point, screenSize: Size)
    point: Point
    screenSize: Size
    rotate(rotation: number): Position
}
```

#### ScreenInfo
```typescript
class ScreenInfo {
    constructor(
        contentRect: Rect,
        videoSize: Size,
        deviceRotation: number
    )
    static fromBuffer(buffer: Buffer): ScreenInfo
}
```

### 控制消息

所有控制消息都继承自 `ControlMessage` 并实现：

```typescript
abstract class ControlMessage {
    toBuffer(): Buffer      // 序列化为 Buffer
    toString(): string      // 转换为可读字符串
    toJSON(): object        // 转换为 JSON 对象
}
```

## 常见问题

### Q: 如何调试控制消息？

A: 所有消息都实现了 `toString()` 和 `toJSON()` 方法：

```typescript
listener: {
    sendMessage: (msg) => {
        console.log('消息类型:', msg.type);
        console.log('可读格式:', msg.toString());
        console.log('JSON:', JSON.stringify(msg.toJSON(), null, 2));
        console.log('Buffer:', msg.toBuffer());
    }
}
```

### Q: 如何处理图片资源错误？

A: 图片仅用于多点触控可视化。如果遇到导入错误：

1. **配置构建工具**（推荐）- 参见[构建工具配置](#构建工具配置)
2. **忽略错误** - 功能仍正常，只是没有图片显示

### Q: 如何获取实时坐标？

A: 在消息监听器中获取：

```typescript
sendMessage: (message) => {
    if (message instanceof TouchControlMessage) {
        const { x, y } = message.position.point;
        console.log(`坐标: (${x}, ${y})`);
    }
}
```

### Q: 如何禁用多点触控？

A: 多点触控需要按住 Ctrl 键才激活，用户不按就不会触发。

### Q: 如何清理资源？

A: 调用 `release()` 方法：

```typescript
// 创建
const handler = new FeaturedInteractionHandler(player, listener);

// 清理
handler.release();

// 键盘监听器
KeyInputHandler.removeEventListener(listener);
```

### Q: 能否在移动端使用？

A: 可以。`FeaturedInteractionHandler` 自动处理触摸事件，在移动设备上会使用原生触摸事件。

### Q: 如何修改键盘映射？

A: 键盘映射定义在 `KeyToCodeMap` 中。如需自定义，可以创建新的 Map：

```typescript
import { KeyEvent } from 'interaction-system';

const customMap = new Map([
    ['KeyA', KeyEvent.KEYCODE_A],
    // ... 添加更多映射
]);
```

### Q: 支持哪些浏览器？

A: 支持所有现代浏览器：
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器（iOS Safari, Chrome Mobile）

### Q: TypeScript 类型定义在哪里？

A: 包自带完整的类型定义文件（`.d.ts`），会被 TypeScript 自动识别。

## 更多帮助

- [README.md](README.md) - 项目概览和快速开始
- [examples/](examples/) - 完整示例项目
- [GitHub Issues](https://github.com/NetrisTV/ws-scrcpy/issues) - 报告问题

## 贡献

欢迎提交 Issue 和 Pull Request！


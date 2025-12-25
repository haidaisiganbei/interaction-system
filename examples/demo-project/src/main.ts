import {
    FeaturedInteractionHandler,
    InteractionHandlerListener,
    KeyInputHandler,
    KeyEventListener,
    ControlMessage,
    TouchControlMessage,
    ScrollControlMessage,
    KeyCodeControlMessage,
    ScreenInfo,
    Rect,
    Size,
    Point,
    Position,
    MotionEvent,
    IPlayer
} from 'interaction-system';

// 统计数据
const stats = {
    total: 0,
    touch: 0,
    key: 0,
    scroll: 0
};

// 实现 IPlayer 接口
class DemoPlayer implements IPlayer {
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

// 日志函数
function log(message: string) {
    const logContainer = document.getElementById('logContainer')!;
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    
    const time = document.createElement('div');
    time.className = 'log-time';
    time.textContent = `[${new Date().toLocaleTimeString()}]`;
    
    const content = document.createElement('div');
    content.textContent = message;
    
    entry.appendChild(time);
    entry.appendChild(content);
    logContainer.appendChild(entry);
    
    // 自动滚动到底部
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // 限制日志条数
    while (logContainer.children.length > 50) {
        logContainer.removeChild(logContainer.firstChild!);
    }
}

// 更新统计信息
function updateStats() {
    document.getElementById('totalMessages')!.textContent = stats.total.toString();
    document.getElementById('touchMessages')!.textContent = stats.touch.toString();
    document.getElementById('keyMessages')!.textContent = stats.key.toString();
}

// 更新位置信息
function updatePosition(x: number, y: number) {
    document.getElementById('lastPosition')!.textContent = `(${x}, ${y})`;
}

// 初始化应用
function init() {
    // 获取 canvas 元素
    const canvas = document.getElementById('interactionCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    // 创建播放器
    const player = new DemoPlayer(canvas);

    // 设置屏幕信息
    const screenInfo = new ScreenInfo(
        new Rect(0, 0, 360, 720),  // 内容区域
        new Size(360, 720),         // 视频尺寸
        0                              // 设备旋转
    );
    player.setScreenInfo(screenInfo);

    // 创建消息监听器
    const listener: InteractionHandlerListener = {
        sendMessage: (message: ControlMessage) => {
            stats.total++;
            log(`Received message: ${message.toBuffer().toString('hex')}`);
            if (message instanceof TouchControlMessage) {
                stats.touch++;
                const action = 
                    message.action === MotionEvent.ACTION_DOWN ? '按下' :
                    message.action === MotionEvent.ACTION_UP ? '抬起' : '移动';
                const { x, y } = message.position.point;
                updatePosition(Math.round(x), Math.round(y));
                log(`触摸${action}: (${Math.round(x)}, ${Math.round(y)}) 指针:${message.pointerId}`);
            } else if (message instanceof ScrollControlMessage) {
                stats.scroll++;
                const { x, y } = message.position.point;
                log(`滚动: (${Math.round(x)}, ${Math.round(y)}) H:${message.hScroll} V:${message.vScroll}`);
            }
            
            updateStats();
        }
    };

    // 创建交互处理器
    const handler = new FeaturedInteractionHandler(player, listener);
    log('✅ 交互处理器已初始化');

    // 键盘监听器
    const keyListener: KeyEventListener = {
        onKeyEvent: (event: KeyCodeControlMessage) => {
            stats.key++;
            stats.total++;
            const action = event.action === 0 ? '按下' : '抬起';
            log(`键盘${action}: 键码=${event.keycode} 重复=${event.repeat}`);
            updateStats();
        }
    };

    KeyInputHandler.addEventListener(keyListener);
    log('⌨️ 键盘监听器已启动');

    // 清空日志按钮
    document.getElementById('clearLog')?.addEventListener('click', () => {
        const logContainer = document.getElementById('logContainer')!;
        logContainer.innerHTML = '<div class="log-entry"><div class="log-time">[日志已清空]</div></div>';
        stats.total = 0;
        stats.touch = 0;
        stats.key = 0;
        stats.scroll = 0;
        updateStats();
    });

    // 模拟触摸按钮
    document.getElementById('simulateTouch')?.addEventListener('click', () => {
        // 创建模拟触摸消息
        const touchMessage = new TouchControlMessage(
            MotionEvent.ACTION_DOWN,
            0,
            new Position(
                new Point(180, 360),
                new Size(360, 720)
            ),
            1.0,
            MotionEvent.BUTTON_PRIMARY
        );
        
        listener.sendMessage(touchMessage);
        log('🎯 模拟触摸: 中心点 (180, 360)');
    });

    log('🚀 Demo 应用已就绪');
    log('👆 请在画布上进行交互...');
}

// 启动应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


import ScreenInfo from '../models/ScreenInfo';

/**
 * IPlayer 接口 - 用于交互系统的播放器抽象
 * 
 * 任何实现了此接口的类都可以作为交互处理器的目标
 */
export interface IPlayer {
    /**
     * 获取可触摸的 Canvas 元素
     * 此元素用于捕获用户的触摸、鼠标等交互事件
     */
    getTouchableElement(): HTMLCanvasElement;
    
    /**
     * 获取屏幕信息
     * 包含视频尺寸、内容区域等信息，用于坐标转换
     */
    getScreenInfo(): ScreenInfo | undefined;
}


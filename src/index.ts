// 交互处理器
export { InteractionHandler } from './interaction/InteractionHandler';
export { FeaturedInteractionHandler } from './interaction/FeaturedInteractionHandler';
export type { InteractionHandlerListener } from './interaction/FeaturedInteractionHandler';
export { SimpleInteractionHandler } from './interaction/SimpleInteractionHandler';
export type { TouchHandlerListener } from './interaction/SimpleInteractionHandler';

// 控制消息
export { ControlMessage } from './messages/ControlMessage';
export type { ControlMessageInterface } from './messages/ControlMessage';
export { TouchControlMessage } from './messages/TouchControlMessage';
export type { TouchControlMessageInterface } from './messages/TouchControlMessage';
export { ScrollControlMessage } from './messages/ScrollControlMessage';
export type { ScrollControlMessageInterface } from './messages/ScrollControlMessage';
export { KeyCodeControlMessage } from './messages/KeyCodeControlMessage';
export type { KeyCodeControlMessageInterface } from './messages/KeyCodeControlMessage';
export { TextControlMessage } from './messages/TextControlMessage';
export type { TextControlMessageInterface } from './messages/TextControlMessage';
export { CommandControlMessage, FilePushState } from './messages/CommandControlMessage';

// 键盘处理
export { KeyInputHandler } from './input/KeyInputHandler';
export type { KeyEventListener } from './input/KeyInputHandler';
export { default as KeyEvent } from './input/KeyEvent';
export { KeyToCodeMap } from './input/KeyToCodeMap';
export { default as UIEventsCode } from './input/UIEventsCode';

// 数据模型
export { default as Point } from './models/Point';
export type { PointInterface } from './models/Point';
export { default as Size } from './models/Size';
export type { SizeInterface } from './models/Size';
export { default as Position } from './models/Position';
export type { PositionInterface } from './models/Position';
export { default as Rect } from './models/Rect';
export { default as MotionEvent } from './models/MotionEvent';
export { default as ScreenInfo } from './models/ScreenInfo';

// 接口
export type { IPlayer } from './types/PlayerInterface';

// 类型定义
export type { InteractionEvents, TouchEventNames, KeyEventNames } from './interaction/InteractionHandler';

// 工具类
export { default as Util } from './utils/Util';


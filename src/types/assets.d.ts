/**
 * 资源文件类型声明
 * 用于支持在 TypeScript 中导入图片等静态资源
 */

declare module '*.png' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.gif' {
    const content: string;
    export default content;
}

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.webp' {
    const content: string;
    export default content;
}


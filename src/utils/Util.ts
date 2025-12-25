/**
 * 工具函数类
 * 提供交互系统所需的辅助功能
 */
export default class Util {
    private static supportsPassiveValue: boolean | undefined;

    /**
     * 将字符串转换为 UTF-8 字节数组
     * @param str 待转换的字符串
     * @returns UTF-8 字节数组
     */
    static stringToUtf8ByteArray = function(str: string) {
        // TODO(user): Use native implementations if/when available
        var out = [], p = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c < 128) {
                out[p++] = c;
            } else if (c < 2048) {
                out[p++] = (c >> 6) | 192;
                out[p++] = (c & 63) | 128;
            } else if (
                ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
                ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
                // Surrogate Pair
                c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
                out[p++] = (c >> 18) | 240;
                out[p++] = ((c >> 12) & 63) | 128;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            } else {
                out[p++] = (c >> 12) | 224;
                out[p++] = ((c >> 6) & 63) | 128;
                out[p++] = (c & 63) | 128;
            }
        }
        return Uint8Array.from(out);
    };

    /**
     * 将 UTF-8 字节数组转换为 JavaScript 字符串
     * @param bytes UTF-8 字节数组
     * @returns 16位 Unicode 字符串
     */
    static utf8ByteArrayToString(bytes: Uint8Array): string {
        // TODO(user): Use native implementations if/when available
        var out = [], pos = 0, c = 0;
        while (pos < bytes.length) {
            var c1 = bytes[pos++];
            if (c1 < 128) {
                out[c++] = String.fromCharCode(c1);
            } else if (c1 > 191 && c1 < 224) {
                var c2 = bytes[pos++];
                out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
            } else if (c1 > 239 && c1 < 365) {
                // Surrogate Pair
                var c2 = bytes[pos++];
                var c3 = bytes[pos++];
                var c4 = bytes[pos++];
                var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
                    0x10000;
                out[c++] = String.fromCharCode(0xD800 + (u >> 10));
                out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
            } else {
                var c2 = bytes[pos++];
                var c3 = bytes[pos++];
                out[c++] =
                    String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
            }
        }
        return out.join('');
    };

    /**
     * 检测浏览器是否支持 passive 事件监听器
     * 参考: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
     * @returns 是否支持 passive 选项
     */
    static supportsPassive(): boolean {
        if (typeof Util.supportsPassiveValue === 'boolean') {
            return Util.supportsPassiveValue;
        }

        // Test via a getter in the options object to see if the passive property is accessed
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function() {
                    supportsPassive = true;
                }
            });

            // @ts-ignore
            window.addEventListener('testPassive', null, opts);
            // @ts-ignore
            window.removeEventListener('testPassive', null, opts);
        } catch (error: any) {}

        return Util.supportsPassiveValue = supportsPassive;
    }
}


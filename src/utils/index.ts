
export function HTMLToElement(html: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.firstChild as HTMLElement;
}

export function escapeHTML(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function unescapeHTML(str: string): string {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div.textContent || '';
}

// 从思源源码中复制的addStyle
export const addStyle = (url: string, id: string) => {
    if (!document.getElementById(id)) {
        const styleElement = document.createElement("link");
        styleElement.id = id;
        styleElement.rel = "stylesheet";
        styleElement.type = "text/css";
        styleElement.href = url;
        const pluginsStyle = document.querySelector("#pluginsStyle");
        if (pluginsStyle) {
            pluginsStyle.before(styleElement);
        } else {
            document.getElementsByTagName("head")[0].appendChild(styleElement);
        }
    }
};

// 从思源源码中复制的addScript
export const addScript = (path: string, id: string) => {
    return new Promise((resolve) => {
        if (document.getElementById(id)) {
            // 脚本加载后再次调用直接返回
            resolve(false);
            return false;
        }
        const scriptElement = document.createElement("script");
        scriptElement.src = path;
        scriptElement.async = true;
        // 循环调用时 Chrome 不会重复请求 js
        document.head.appendChild(scriptElement);
        scriptElement.onload = () => {
            if (document.getElementById(id)) {
                // 循环调用需清除 DOM 中的 script 标签
                scriptElement.remove();
                resolve(false);
                return false;
            }
            scriptElement.id = id;
            resolve(true);
        };
    });
};

export function unicodeToBase64(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  let binary = '';
  const len = bytes.length;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToUnicode(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function dataURLToBlob(dataURL: string): Blob {
  const urlParts = dataURL.split(',');
  const mime = urlParts[0].match(/:(.*?);/)![1];
  const base64 = urlParts[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

export async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function blobToArray(blob: Blob): Promise<Uint8Array> {
  if (typeof blob.arrayBuffer === "function") {
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export async function blobToBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === "function") {
    const arrayBuffer = await blob.arrayBuffer();
    return arrayBuffer;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export function mimeTypeToFormat(mime: string): string {
  const mineToFormat = {
    'image/svg+xml': 'svg',
    'image/png': 'png',
  };
  return mineToFormat[mime] || '';
}

export function formatToMimeType(format: string): string {
  const formatToMimeType = {
    'svg' : 'image/svg+xml',
    'png' : 'image/png',
  };
  return formatToMimeType[format] || '';
}

export function mimeTypeOfDataURL(dataURL: string): string {
  const mime = dataURL.match(/:(.*?);/)![1];
  return mime || '';
}

export function getPNGSize(bytes: Uint8Array): { width: number, height: number } | null {
  // 3. 检查 PNG 签名（前8字节）
  const pngSignature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== pngSignature[i]) {
      console.warn('Invalid PNG signature');
      return null;
    }
  }

  // 4. 读取 IHDR 中的 width 和 height（大端序，从第16字节开始？注意：IHDR chunk 在第8字节后开始）
  // 实际结构：
  // - bytes[0..7]: signature
  // - bytes[8..11]: chunk length (should be 13 for IHDR)
  // - bytes[12..15]: chunk type "IHDR"
  // - bytes[16..19]: width (4 bytes, big-endian)
  // - bytes[20..23]: height (4 bytes, big-endian)

  if (bytes.length < 24) {
    console.warn('PNG data too short');
    return null;
  }

  // 可选：验证 chunk type is "IHDR"
  const ihdrType = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);
  if (ihdrType !== 'IHDR') {
    console.warn('First chunk is not IHDR');
    return null;
  }

  const width = (
    (bytes[16] << 24) |
    (bytes[17] << 16) |
    (bytes[18] << 8) |
    bytes[19]
  ) >>> 0; // 无符号

  const height = (
    (bytes[20] << 24) |
    (bytes[21] << 16) |
    (bytes[22] << 8) |
    bytes[23]
  ) >>> 0;

  return {
    width: width,
    height: height,
  };
}

export function getSVGSize(svg: HTMLElement | SVGSVGElement): { width: number, height: number } | null {
  if (svg.tagName.toLowerCase() !== 'svg') return null;

  // Try getBoundingClientRect-like intrinsic size
  const widthAttr = svg.getAttribute('width');
  const heightAttr = svg.getAttribute('height');
  const viewBox = svg.getAttribute('viewBox');

  const parseLength = (val: string | null): number | null => {
    if (!val) return null;
    const match = val.match(/^(\d+(?:\.\d+)?)$/); // only pure number or float
    if (match) return parseFloat(match[1]);
    const pxMatch = val.match(/^(\d+(?:\.\d+)?)px$/i);
    if (pxMatch) return parseFloat(pxMatch[1]);
    return null;
  };

  let w = parseLength(widthAttr);
  let h = parseLength(heightAttr);

  if ((w === null || h === null) && viewBox) {
    const vb = viewBox.trim().split(/\s+/).map(Number);
    if (vb.length === 4 && !vb.some(isNaN)) {
      if (w === null) w = vb[2];
      if (h === null) h = vb[3];
    }
  }

  return w != null && h != null && w > 0 && h > 0 ? { width: w, height: h } : null;
}

export function base64ToArray(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function arrayToBase64(array: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < array.length; i++) {
    binary += String.fromCharCode(array[i]);
  }
  return btoa(binary);
}

export function locatePNGtEXt(data: Uint8Array): { index: number; length: number } | null {
  if (data.length < 8) return null;

  // 检查 PNG 文件头（可选，但推荐）
  const pngSignature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  for (let i = 0; i < 8; i++) {
    if (data[i] !== pngSignature[i]) {
      return null; // 不是合法 PNG
    }
  }

  let offset = 8; // 跳过签名

  while (offset <= data.length - 12) {
    // 读取 Length（大端序，4字节）
    const length = (
      (data[offset] << 24) |
      (data[offset + 1] << 16) |
      (data[offset + 2] << 8) |
      data[offset + 3]
    ) >>> 0;

    // 检查是否超出文件边界
    if (offset + 12 + length > data.length) {
      break; // chunk 不完整
    }

    // 读取 Chunk Type（4字节）
    const typeBytes = data.subarray(offset + 4, offset + 8);
    const typeStr = String.fromCharCode(...typeBytes);

    if (typeStr === 'tEXt') {
      // 找到 tEXt chunk
      return { index: offset, length: 12 + length };
    }

    // 跳到下一个 chunk（12 = 4 Length + 4 Type + 4 CRC）
    offset += 12 + length;
  }

  return null; // 未找到 tEXt
}

export function replaceSubArray(
  srcArray: Uint8Array,
  srcSubArrayLocation: { index: number; length: number },
  destArray: Uint8Array,
  destSubArrayLocation: { index: number; length: number }
): Uint8Array {
  const { index: srcIndex, length: srcLength } = srcSubArrayLocation;
  const { index: destIndex, length: destLength } = destSubArrayLocation;

  // 边界检查：确保源子数组有效
  if (srcIndex < 0 || srcLength < 0 || srcIndex + srcLength > srcArray.length) {
    throw new Error('Invalid srcSubArrayLocation: out of bounds');
  }

  // 边界检查：确保目标子数组有效
  if (destIndex < 0 || destLength < 0 || destIndex + destLength > destArray.length) {
    throw new Error('Invalid destSubArrayLocation: out of bounds');
  }

  // 提取源子数组
  const srcSubArray = srcArray.subarray(srcIndex, srcIndex + srcLength);

  // 计算新数组长度
  const newLength = destArray.length - destLength + srcSubArray.length;

  // 创建结果数组
  const result = new Uint8Array(newLength);

  // 1. 复制 destArray 的前半部分 [0, destIndex)
  result.set(destArray.subarray(0, destIndex), 0);

  // 2. 插入 srcSubArray
  result.set(srcSubArray, destIndex);

  // 3. 复制 destArray 的后半部分 [destIndex + destLength, end)
  const afterDestIndex = destIndex + destLength;
  const afterSrcIndex = destIndex + srcSubArray.length;
  result.set(destArray.subarray(afterDestIndex), afterSrcIndex);

  return result;
}

export function insertPNGpHYs(data: Uint8Array, dpi: number): Uint8Array {
  if (data.length < 8) throw new Error('Invalid PNG: too short');

  // 验证 PNG 签名
  const pngSignature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  for (let i = 0; i < 8; i++) {
    if (data[i] !== pngSignature[i]) {
      throw new Error('Not a valid PNG file');
    }
  }

  let offset = 8; // 跳过签名

  // Step 1: 找到 IHDR 块并定位其结束位置
  let ihdrEnd = -1;
  while (offset <= data.length - 12) {
    const length = (
      (data[offset] << 24) |
      (data[offset + 1] << 16) |
      (data[offset + 2] << 8) |
      data[offset + 3]
    ) >>> 0;

    if (offset + 12 + length > data.length) break;

    const typeBytes = data.subarray(offset + 4, offset + 8);
    const typeStr = String.fromCharCode(...typeBytes);

    if (typeStr === 'IHDR') {
      ihdrEnd = offset + 12 + length; // IHDR 结束位置（下一个 chunk 开始处）
      break;
    }

    offset += 12 + length;
  }

  if (ihdrEnd === -1) {
    throw new Error('IHDR chunk not found');
  }

  // Step 2: 构造 pHYs chunk data
  const ppm = Math.round(dpi * 39.3701); // pixels per meter
  const physData = new Uint8Array(9);
  // ppm_x (4 bytes, big-endian)
  physData[0] = (ppm >> 24) & 0xff;
  physData[1] = (ppm >> 16) & 0xff;
  physData[2] = (ppm >> 8) & 0xff;
  physData[3] = ppm & 0xff;
  // ppm_y (same as x)
  physData[4] = physData[0];
  physData[5] = physData[1];
  physData[6] = physData[2];
  physData[7] = physData[3];
  // unit = 1 (meter)
  physData[8] = 1;

  // Chunk type "pHYs"
  const physType = new Uint8Array([0x70, 0x48, 0x59, 0x73]); // 'pHYs'

  // Step 3: 计算 CRC32 over "pHYs" + physData
  const crcBuffer = new Uint8Array(physType.length + physData.length);
  crcBuffer.set(physType, 0);
  crcBuffer.set(physData, physType.length);
  const crc = crc32(crcBuffer);

  // Step 4: 构造完整的 pHYs chunk
  const chunkLength = new Uint8Array(4);
  chunkLength[0] = (physData.length >> 24) & 0xff;
  chunkLength[1] = (physData.length >> 16) & 0xff;
  chunkLength[2] = (physData.length >> 8) & 0xff;
  chunkLength[3] = physData.length & 0xff;

  const crcBytes = new Uint8Array(4);
  crcBytes[0] = (crc >> 24) & 0xff;
  crcBytes[1] = (crc >> 16) & 0xff;
  crcBytes[2] = (crc >> 8) & 0xff;
  crcBytes[3] = crc & 0xff;

  const physChunk = new Uint8Array(4 + 4 + physData.length + 4);
  physChunk.set(chunkLength, 0);
  physChunk.set(physType, 4);
  physChunk.set(physData, 8);
  physChunk.set(crcBytes, 8 + physData.length);

  // Step 5: 插入到 IHDR 之后
  const result = new Uint8Array(data.length + physChunk.length);
  // [0, ihdrEnd)
  result.set(data.subarray(0, ihdrEnd), 0);
  // insert pHYs chunk
  result.set(physChunk, ihdrEnd);
  // [ihdrEnd, end)
  result.set(data.subarray(ihdrEnd), ihdrEnd + physChunk.length);

  return result;
}

// --- CRC32 工具函数（PNG 标准）---
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function insertPNGtEXt(data: Uint8Array, tEXt: Uint8Array): Uint8Array {
  if (data.length < 8) throw new Error('Invalid PNG: too short');

  // 验证 PNG 签名
  const pngSignature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  for (let i = 0; i < 8; i++) {
    if (data[i] !== pngSignature[i]) {
      throw new Error('Not a valid PNG file');
    }
  }

  let offset = 8; // 跳过 PNG 签名

  // 查找第一个 IDAT chunk 的起始偏移
  let idatOffset = -1;
  while (offset <= data.length - 12) {
    const length = (
      (data[offset] << 24) |
      (data[offset + 1] << 16) |
      (data[offset + 2] << 8) |
      data[offset + 3]
    ) >>> 0;

    if (offset + 12 + length > data.length) {
      break; // 不完整 chunk，提前终止
    }

    const typeBytes = data.subarray(offset + 4, offset + 8);
    const typeStr = String.fromCharCode(...typeBytes);

    if (typeStr === 'IDAT') {
      idatOffset = offset;
      break;
    }

    offset += 12 + length;
  }

  if (idatOffset === -1) {
    throw new Error('No IDAT chunk found in PNG');
  }

  // 构建新数据：[header...][tEXt][IDAT...]
  const result = new Uint8Array(data.length + tEXt.length);
  result.set(data.subarray(0, idatOffset), 0);               // IDAT 之前的部分
  result.set(tEXt, idatOffset);                              // 插入完整 tEXt chunk
  result.set(data.subarray(idatOffset), idatOffset + tEXt.length); // 原 IDAT 及之后部分

  return result;
}
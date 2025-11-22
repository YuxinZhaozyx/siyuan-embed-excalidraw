
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

export function unicodeToBase64(str: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return btoa(String.fromCharCode(...bytes));
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
  const binary = String.fromCharCode(...new Uint8Array(buffer));
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

function getPNGSizeFromBase64(dataUrl: string): { width: number, height: number } | null {
  // 1. 检查是否是 PNG Data URL
  if (!dataUrl.startsWith('data:image/png;base64,')) {
    console.warn('Not a PNG data URL');
    return null;
  }

  // 2. 提取 base64 部分并解码为 Uint8Array
  const base64 = dataUrl.split(',')[1];
  if (!base64) return null;

  let binaryString: string;
  try {
    binaryString = atob(base64);
  } catch (e) {
    console.warn('Invalid base64 string');
    return null;
  }

  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

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

function getSVGSizeFromBase64(dataUrl: string): { width: number, height: number } | null { 
  if (!dataUrl.startsWith('data:image/svg+xml;base64,')) {
    console.warn('Not a SVG data URL');
    return null;
  }

  const base64 = dataUrl.split(',')[1];
  if (!base64) return null;

  let xmlStr: string;
  try {
    xmlStr = atob(base64);
  } catch {
    return null;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, 'image/svg+xml');
  const svg = doc.documentElement;

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

export function getImageSizeFromBase64(dataUrl: string): { width: number, height: number } | null {
  if (dataUrl.startsWith('data:image/png;base64,')) {
    return getPNGSizeFromBase64(dataUrl);
  }
  else if (dataUrl.startsWith('data:image/svg+xml;base64,')) {
    return getSVGSizeFromBase64(dataUrl);
  }
  return null;
}


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
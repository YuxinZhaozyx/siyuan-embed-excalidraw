
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

import { MAC_SYMBOLS } from "./enums";

export const isMac = () => typeof navigator !== "undefined" &&
  navigator.platform.toLowerCase().includes("mac")

export const getShortcutKeyText = (shortcutKey: string[]) => {
  return shortcutKey?.map(it => (isMac() ? (MAC_SYMBOLS[it as keyof typeof MAC_SYMBOLS] || it) : it)).join('+');
}

export const replacePreCode = (html: string) => {
  return html.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, codeContent) => {
    const processedCode = codeContent.replace(/\n/g, '<br/>');
    return `<pre><code>${processedCode}</code></pre>`;
  });
}
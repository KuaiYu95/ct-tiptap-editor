import { MAC_SYMBOLS } from "./enums";

export const getShortcutKeyText = (shortcutKey: string[]) => {
  return shortcutKey?.map(it => (isMac() ? (MAC_SYMBOLS[it as keyof typeof MAC_SYMBOLS] || it) : it)).join('+');
}

export const isMac = () => typeof navigator !== "undefined" &&
  navigator.platform.toLowerCase().includes("mac")

export function addOpacityToColor(color: string, opacity: number) {
  let red, green, blue;

  if (color.startsWith("#")) {
    red = parseInt(color.slice(1, 3), 16);
    green = parseInt(color.slice(3, 5), 16);
    blue = parseInt(color.slice(5, 7), 16);
  } else if (color.startsWith("rgb")) {
    const matches = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/) as RegExpMatchArray;
    red = parseInt(matches[1], 10);
    green = parseInt(matches[2], 10);
    blue = parseInt(matches[3], 10);
  } else {
    return "";
  }

  const alpha = opacity;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function setHeadingsId(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach((heading) => {
    if (!heading.id) {
      heading.id = `heading-${Math.random().toString(36).substring(2, 15)}`;
    }
  });
  return doc.body.innerHTML;
}

export const extractHeadings = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  return Array.from(headings).map(heading => {
    const level = parseInt(heading.tagName[1]);
    const id = heading.id || `heading-${Math.random().toString(36).substring(2, 15)}`
    return {
      title: heading.textContent || '',
      heading: level as 1 | 2 | 3 | 4 | 5 | 6,
      id
    };
  });
}
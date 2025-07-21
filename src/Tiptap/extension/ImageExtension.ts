import Image from '@tiptap/extension-image';

const ImageExtension = Image.extend({
  group: "inline",

  inline: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => {
          // 优先从width属性读取
          const width = element.getAttribute('width')
          if (width) return parseInt(width)

          // 其次从style中读取
          const style = element.getAttribute('style')
          if (style) {
            const widthMatch = style.match(/width:\s*(\d+)px/)
            if (widthMatch) return parseInt(widthMatch[1])
          }

          return null
        },
        renderHTML: attributes => {
          if (!attributes.width) return {}
          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          // 优先从height属性读取
          const height = element.getAttribute('height')
          if (height) return parseInt(height)

          // 其次从style中读取
          const style = element.getAttribute('style')
          if (style) {
            const heightMatch = style.match(/height:\s*(\d+)px/)
            if (heightMatch) return parseInt(heightMatch[1])
          }

          return null
        },
        renderHTML: attributes => {
          if (!attributes.height) return {}
          return { height: attributes.height }
        },
      },
    }
  },
  renderHTML({ HTMLAttributes }) {
    const { width, height, ...otherAttrs } = HTMLAttributes;
    const styleObject: Record<string, string> = {};

    if (width) styleObject.width = `${width}px`;
    if (height) styleObject.height = `${height}px`;

    if (!width && !height) {
      styleObject.width = 'auto';
      styleObject.height = 'auto';
    }

    styleObject.display = 'inline-block';
    styleObject['vertical-align'] = 'middle';
    styleObject.margin = '0 8px';

    const style = Object.entries(styleObject)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');

    return ["img", {
      ...otherAttrs,
      style: style || undefined,
      width: width || undefined,
      height: height || undefined
    }]
  },
});

export default ImageExtension; 
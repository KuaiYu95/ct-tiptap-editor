import TableCell from '@tiptap/extension-table-cell';

const TableCellExtension = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => ({
          style: attributes.style,
        }),
      },
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color') || element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes.backgroundColor) return {};
          return {
            style: `background-color: ${attributes.backgroundColor}`,
            'data-background-color': attributes.backgroundColor
          };
        },
      },
      textAlign: {
        default: null,
        parseHTML: element => element.getAttribute('data-text-align') || element.style.textAlign,
        renderHTML: attributes => {
          if (!attributes.textAlign) return {};
          return {
            style: `text-align: ${attributes.textAlign}`,
            'data-text-align': attributes.textAlign
          };
        },
      },
      fontSize: {
        default: null,
        parseHTML: element => element.getAttribute('data-font-size') || element.style.fontSize,
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return {
            style: `font-size: ${attributes.fontSize}`,
            'data-font-size': attributes.fontSize
          };
        },
      },
      fontWeight: {
        default: null,
        parseHTML: element => element.getAttribute('data-font-weight') || element.style.fontWeight,
        renderHTML: attributes => {
          if (!attributes.fontWeight) return {};
          return {
            style: `font-weight: ${attributes.fontWeight}`,
            'data-font-weight': attributes.fontWeight
          };
        },
      },
      fontStyle: {
        default: null,
        parseHTML: element => element.getAttribute('data-font-style') || element.style.fontStyle,
        renderHTML: attributes => {
          if (!attributes.fontStyle) return {};
          return {
            style: `font-style: ${attributes.fontStyle}`,
            'data-font-style': attributes.fontStyle
          };
        },
      },
      borderColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-color') || element.style.borderColor,
        renderHTML: attributes => {
          if (!attributes.borderColor) return {};
          return {
            style: `border-color: ${attributes.borderColor}`,
            'data-border-color': attributes.borderColor
          };
        },
      },
      borderWidth: {
        default: null,
        parseHTML: element => element.getAttribute('data-border-width') || element.style.borderWidth,
        renderHTML: attributes => {
          if (!attributes.borderWidth) return {};
          return {
            style: `border-width: ${attributes.borderWidth}`,
            'data-border-width': attributes.borderWidth
          };
        },
      },
      padding: {
        default: null,
        parseHTML: element => element.getAttribute('data-padding') || element.style.padding,
        renderHTML: attributes => {
          if (!attributes.padding) return {};
          return {
            style: `padding: ${attributes.padding}`,
            'data-padding': attributes.padding
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setTableCellBackgroundColor: (backgroundColor: string) => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { backgroundColor });
      },
      setTableCellTextAlign: (textAlign: 'left' | 'center' | 'right' | 'justify') => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { textAlign });
      },
      setTableCellFontSize: (fontSize: string) => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { fontSize });
      },
      setTableCellFontWeight: (fontWeight: 'normal' | 'bold') => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { fontWeight });
      },
      setTableCellFontStyle: (fontStyle: 'normal' | 'italic') => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { fontStyle });
      },
      setTableCellBorderColor: (borderColor: string) => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { borderColor });
      },
      setTableCellBorderWidth: (borderWidth: string) => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { borderWidth });
      },
      setTableCellPadding: (padding: string) => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { padding });
      },
    };
  },
});

export default TableCellExtension; 
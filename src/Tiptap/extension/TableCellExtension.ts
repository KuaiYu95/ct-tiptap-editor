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
    };
  },
});

export default TableCellExtension; 
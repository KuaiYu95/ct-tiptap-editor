import { Editor } from '@tiptap/core';

export interface TablePosition {
  mouseX: number;
  mouseY: number;
}

export interface TableOperations {
  insertColumnLeft: () => void;
  insertColumnRight: () => void;
  insertRowAbove: () => void;
  insertRowBelow: () => void;
  deleteColumn: () => void;
  deleteRow: () => void;
  deleteTable: () => void;
  mergeCells: () => void;
  splitCell: () => void;
  toggleHeaderRow: () => void;
  toggleHeaderColumn: () => void;
}

export interface TableContextMenuProps {
  editor: Editor;
  contextMenu: TablePosition | null;
  onClose: () => void;
  operations: TableOperations;
}

export interface TableToolbarProps {
  editor: Editor;
  onInsertTable: () => void;
}

export interface EditorTableProps {
  editor: Editor;
}

export interface TableCellInfo {
  canMerge: boolean;
  canSplit: boolean;
  isInHeader: boolean;
  isMultiSelection: boolean;
} 
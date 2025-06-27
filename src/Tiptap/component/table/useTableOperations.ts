import { Editor } from '@tiptap/core';
import { useCallback } from 'react';
import { TableOperations } from './types';

/**
 * 表格操作钩子
 */
export const useTableOperations = (editor: Editor): TableOperations => {
  const insertColumnLeft = useCallback(() => {
    editor.chain().focus().addColumnBefore().run();
  }, [editor]);

  const insertColumnRight = useCallback(() => {
    editor.chain().focus().addColumnAfter().run();
  }, [editor]);

  const insertRowAbove = useCallback(() => {
    editor.chain().focus().addRowBefore().run();
  }, [editor]);

  const insertRowBelow = useCallback(() => {
    editor.chain().focus().addRowAfter().run();
  }, [editor]);

  const deleteColumn = useCallback(() => {
    editor.chain().focus().deleteColumn().run();
  }, [editor]);

  const deleteRow = useCallback(() => {
    editor.chain().focus().deleteRow().run();
  }, [editor]);

  const deleteTable = useCallback(() => {
    editor.chain().focus().deleteTable().run();
  }, [editor]);

  const mergeCells = useCallback(() => {
    if (editor.can().mergeCells()) {
      editor.chain().focus().mergeCells().run();
    }
  }, [editor]);

  const splitCell = useCallback(() => {
    if (editor.can().splitCell()) {
      editor.chain().focus().splitCell().run();
    }
  }, [editor]);

  const toggleHeaderRow = useCallback(() => {
    editor.chain().focus().toggleHeaderRow().run();
  }, [editor]);

  const toggleHeaderColumn = useCallback(() => {
    editor.chain().focus().toggleHeaderColumn().run();
  }, [editor]);

  return {
    insertColumnLeft,
    insertColumnRight,
    insertRowAbove,
    insertRowBelow,
    deleteColumn,
    deleteRow,
    deleteTable,
    mergeCells,
    splitCell,
    toggleHeaderRow,
    toggleHeaderColumn,
  };
}; 
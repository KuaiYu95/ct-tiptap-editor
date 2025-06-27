import { type Editor } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';
import React, { useCallback, useEffect, useState } from 'react';
import TableContextMenu from './table/TableContextMenu';
import TableToolbar from './table/TableToolbar';
import { TablePosition } from './table/types';
import { useTableOperations } from './table/useTableOperations';
import { addTableStyles, getTableCell, setCellSelected } from './table/utils';

const EditorTable = ({ editor }: { editor: Editor }) => {
  const [contextMenu, setContextMenu] = useState<TablePosition | null>(null);
  const [selectedCell, setSelectedCell] = useState<HTMLElement | null>(null);

  const operations = useTableOperations(editor);

  // 插入默认表格 (3x6, 带表头)
  const insertTable = useCallback(() => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 6, withHeaderRow: true })
      .run();
  }, [editor]);

  // 处理右键菜单
  const handleContextMenu = useCallback((e: Event) => {
    const mouseEvent = e as MouseEvent;
    // 只在可编辑模式下处理右键菜单
    if (!editor.isEditable) return;

    const cell = getTableCell(mouseEvent.target as HTMLElement);
    if (!cell) return;

    e.preventDefault();

    // 检查当前是否是多选状态
    const { selection } = editor.state;
    const isMultiSelection = selection.constructor.name === 'CellSelection';

    // 如果不是多选状态，设置编辑器选区到当前单元格
    if (!isMultiSelection) {
      const pos = editor.view.posAtDOM(cell, 0);
      const $pos = editor.state.doc.resolve(pos);
      const textSelection = TextSelection.create(editor.state.doc, $pos.pos);
      editor.view.dispatch(editor.state.tr.setSelection(textSelection));

      // 更新选中单元格样式
      const newSelectedCell = setCellSelected(cell, selectedCell);
      setSelectedCell(newSelectedCell);
    } else {
      // 多选状态下，清除单个选中样式
      if (selectedCell) {
        setCellSelected(null, selectedCell);
        setSelectedCell(null);
      }
    }

    // 显示右键菜单
    setContextMenu({
      mouseX: mouseEvent.clientX,
      mouseY: mouseEvent.clientY,
    });
  }, [editor, selectedCell]);

  // 处理单元格点击（支持鼠标按住拖拽选择多个单元格）
  const handleCellClick = useCallback((e: Event) => {
    const mouseEvent = e as MouseEvent;
    if (!editor.isEditable) return;

    const cell = getTableCell(mouseEvent.target as HTMLElement);
    if (!cell) return;

    // 阻止默认的点击行为，让Tiptap内置的表格选择功能生效
    // Tiptap的表格插件会自动处理拖拽多选

    // 只在普通点击时设置单个选中样式
    if (!mouseEvent.shiftKey && !mouseEvent.ctrlKey && !mouseEvent.metaKey) {
      const pos = editor.view.posAtDOM(cell, 0);
      if (pos >= 0) {
        const $pos = editor.state.doc.resolve(pos);
        const textSelection = TextSelection.create(editor.state.doc, $pos.pos);
        editor.view.dispatch(editor.state.tr.setSelection(textSelection));

        // 更新选中单元格样式
        const newSelectedCell = setCellSelected(cell, selectedCell);
        setSelectedCell(newSelectedCell);
      }
    }
  }, [editor, selectedCell]);

  // 关闭菜单并重置样式
  const closeMenu = useCallback(() => {
    setContextMenu(null);
    if (selectedCell) {
      setCellSelected(null, selectedCell);
      setSelectedCell(null);
    }
  }, [selectedCell]);

  // 设置表格样式和事件监听
  useEffect(() => {
    if (!editor) return;

    const updateStyles = () => {
      addTableStyles(editor);
    };

    // 使用requestAnimationFrame确保DOM已更新
    const delayedUpdateStyles = () => {
      requestAnimationFrame(() => {
        addTableStyles(editor);
      });
    };

    const element = editor.options.element;

    // 添加事件监听器
    element.addEventListener('contextmenu', handleContextMenu);
    element.addEventListener('click', handleCellClick);

    // 监听编辑器更新 - 使用延迟更新确保DOM已渲染
    editor.on('update', delayedUpdateStyles);
    editor.on('transaction', delayedUpdateStyles);
    editor.on('focus', updateStyles);
    editor.on('selectionUpdate', delayedUpdateStyles);

    // 初始化样式
    updateStyles();

    return () => {
      // 清理事件监听器
      element.removeEventListener('contextmenu', handleContextMenu);
      element.removeEventListener('click', handleCellClick);
      editor.off('update', delayedUpdateStyles);
      editor.off('transaction', delayedUpdateStyles);
      editor.off('focus', updateStyles);
      editor.off('selectionUpdate', delayedUpdateStyles);

      // 清理选中状态
      if (selectedCell) {
        setCellSelected(null, selectedCell);
      }
    };
  }, [editor, handleContextMenu, handleCellClick, selectedCell]);

  return (
    <>
      <TableToolbar editor={editor} onInsertTable={insertTable} />
      <TableContextMenu
        editor={editor}
        contextMenu={contextMenu}
        onClose={closeMenu}
        operations={operations}
      />
    </>
  );
};

export default EditorTable;
import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
} from '@mui/material';
import { type Editor } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';
import React, { useEffect, useState } from 'react';
import { TableAddRowIcon } from '../icons/table-add-row';
import { TableDelIcon } from '../icons/table-del';
import { TableDelColumnIcon } from '../icons/table-del-column-icon';
import { TableHeadIcon } from '../icons/table-head';
import { TableIcon } from '../icons/table-icon';
import { TableMergeCellIcon } from '../icons/table-merge-cell';
import { TableSplitCellIcon } from '../icons/table-split-cell';
import EditorToolbarButton from './EditorToolbarButton';

const EditorTable = ({ editor }: { editor: Editor }) => {
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [selectedCell, setSelectedCell] = useState<HTMLElement | null>(null);
  const [mergeMenu, setMergeMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);

  // 插入表格（支持自定义行列数）
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 5, withHeaderRow: true })
      .run();
  };

  // 检测是否选中了多个单元格
  const checkMultiSelection = () => {
    const selection = editor.state.selection;
    if (!selection || !selection.$from || !selection.$to) return false;

    const $from = selection.$from;
    const $to = selection.$to;

    // 检查是否跨越了多个单元格
    return $from.pos !== $to.pos &&
      ($from.node().type.name === 'tableCell' || $from.node().type.name === 'tableHeader') &&
      ($to.node().type.name === 'tableCell' || $to.node().type.name === 'tableHeader');
  };

  // 监听选择变化和鼠标松开事件
  useEffect(() => {
    if (!editor) return;

    let isSelecting = false;

    const handleMouseDown = () => {
      isSelecting = true;
    };

    const handleMouseUp = () => {
      if (isSelecting) {
        // 延迟一点时间确保选择状态已更新
        setTimeout(() => {
          const isMultiSelected = checkMultiSelection();

          if (isMultiSelected) {
            // 获取当前鼠标位置或选区中心位置
            const selection = editor.state.selection;
            const $from = selection.$from;
            const $to = selection.$to;
            const centerPos = ($from.pos + $to.pos) / 2;

            // 获取选区中心在DOM中的位置
            const coords = editor.view.coordsAtPos(centerPos);

            setMergeMenu({
              mouseX: coords.left,
              mouseY: coords.bottom + 10
            });
          } else {
            setMergeMenu(null);
          }
        }, 50);
      }
      isSelecting = false;
    };

    const handleSelectionUpdate = () => {
      // 只在非选择过程中更新菜单状态
      if (!isSelecting) {
        const isMultiSelected = checkMultiSelection();
        if (!isMultiSelected) {
          setMergeMenu(null);
        }
      }
    };

    const element = editor.options.element;
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor]);

  const handleContextMenu = (e: any) => {
    // 只在可编辑模式下处理右键菜单
    if (!editor.isEditable) return;

    const cell = e.target.closest('td, th');
    if (!cell) return;

    e.preventDefault();

    // 设置选区
    const pos = editor.view.posAtDOM(cell, 0);
    const $pos = editor.state.doc.resolve(pos);
    const selection = TextSelection.create(editor.state.doc, $pos.pos);
    editor.view.dispatch(editor.state.tr.setSelection(selection));

    // 更新选中单元格样式
    setSelectedCell(prev => {
      prev?.style.removeProperty('background-color');
      cell.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
      return cell;
    });

    // 显示弹出菜单
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    })
  };

  // 添加CSS样式类来改变表格单元格的鼠标样式
  const addHoverClass = () => {
    const tables = editor.options.element.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.classList.contains('editor-table')) {
        table.classList.add('editor-table');
      }
    });
  };

  // 处理右键点击
  useEffect(() => {
    if (!editor) return;

    // 监听编辑器更新，确保新插入的表格也有正确的样式
    const updateListener = () => {
      addHoverClass();
    };

    const element = editor.options.element;
    element.addEventListener('contextmenu', handleContextMenu);
    editor.on('update', updateListener);
    editor.on('transaction', updateListener);
    editor.on('focus', addHoverClass);
    editor.on('selectionUpdate', addHoverClass);
    addHoverClass();

    return () => {
      element.removeEventListener('contextmenu', handleContextMenu);
      editor.off('update', updateListener);
      editor.off('transaction', updateListener);
      editor.off('focus', addHoverClass);
      editor.off('selectionUpdate', addHoverClass);
      selectedCell?.style.removeProperty('background-color');
    };
  }, [editor]);

  const clearSelectedCell = () => {
    // 清除所有选中单元格的样式
    const selectedCells = editor.options.element.querySelectorAll('.selectedCell');
    selectedCells.forEach(cell => {
      cell.classList.remove('selectedCell');
      (cell as HTMLElement).style.removeProperty('background-color');
    });
  };

  // 关闭菜单并重置样式
  const closeMenu = () => {
    setContextMenu(null);
    clearSelectedCell();
  };

  const closeMergeMenu = () => {
    setMergeMenu(null);
    clearSelectedCell();
  };

  // 表格操作命令
  const tableOperations = {
    insertColumnLeft: () => editor.chain().focus().addColumnBefore().run(),
    insertColumnRight: () => editor.chain().focus().addColumnAfter().run(),
    insertRowAbove: () => editor.chain().focus().addRowBefore().run(),
    insertRowBelow: () => editor.chain().focus().addRowAfter().run(),
    deleteColumn: () => editor.chain().focus().deleteColumn().run(),
    deleteRow: () => editor.chain().focus().deleteRow().run(),
    mergeCells: () => editor.chain().focus().mergeCells().run(),
    splitCell: () => editor.chain().focus().splitCell().run(),
    toggleHeaderRow: () => editor.chain().focus().toggleHeaderRow().run(),
    toggleHeaderColumn: () => editor.chain().focus().toggleHeaderColumn().run(),
    deleteTable: () => editor.chain().focus().deleteTable().run(),
  };

  return (
    <>
      <EditorToolbarButton
        tip='表格，单元格可右键操作'
        icon={<TableIcon sx={{ fontSize: 17 }} />}
        onClick={insertTable}
      />
      <Popover
        open={!!contextMenu && editor.isEditable}
        onClose={closeMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => { tableOperations.insertRowAbove(); closeMenu(); }}>
          <ListItemIcon><TableAddRowIcon sx={{ transform: 'rotate(180deg)', fontSize: 18 }} /></ListItemIcon>
          <ListItemText>上方插入行</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.insertColumnRight(); closeMenu(); }}>
          <ListItemIcon><TableAddRowIcon sx={{ transform: 'rotate(-90deg)', fontSize: 18 }} /></ListItemIcon>
          <ListItemText>右侧插入列</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.insertRowBelow(); closeMenu(); }}>
          <ListItemIcon><TableAddRowIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText>下方插入行</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.insertColumnLeft(); closeMenu(); }}>
          <ListItemIcon><TableAddRowIcon sx={{ transform: 'rotate(90deg)', fontSize: 18 }} /></ListItemIcon>
          <ListItemText>左侧插入列</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { tableOperations.deleteColumn(); closeMenu(); }}>
          <ListItemIcon><TableDelColumnIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText>删除当前列</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.deleteRow(); closeMenu(); }}>
          <ListItemIcon><TableDelColumnIcon sx={{ transform: 'rotate(90deg)', fontSize: 18 }} /></ListItemIcon>
          <ListItemText>删除当前行</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.deleteTable(); closeMenu(); }}>
          <ListItemIcon><TableDelIcon sx={{ fontSize: 20 }} /></ListItemIcon>
          <ListItemText>删除整个表格</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { tableOperations.splitCell(); closeMenu(); }}>
          <ListItemIcon><TableSplitCellIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText>拆分单元格</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { tableOperations.toggleHeaderRow(); closeMenu(); }}>
          <ListItemIcon><TableHeadIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText>切换表头行</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.toggleHeaderColumn(); closeMenu(); }}>
          <ListItemIcon><TableHeadIcon sx={{ transform: 'rotate(90deg)', fontSize: 18 }} /></ListItemIcon>
          <ListItemText>切换表头列</ListItemText>
        </MenuItem>
      </Popover>
      <Popover
        open={!!mergeMenu && editor.isEditable}
        onClose={closeMergeMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          mergeMenu
            ? { top: mergeMenu.mouseY, left: mergeMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => { tableOperations.mergeCells(); closeMergeMenu(); }}>
          <ListItemIcon><TableMergeCellIcon sx={{ fontSize: 18 }} /></ListItemIcon>
          <ListItemText>合并单元格</ListItemText>
        </MenuItem>
      </Popover>
    </>
  );
};

export default EditorTable;
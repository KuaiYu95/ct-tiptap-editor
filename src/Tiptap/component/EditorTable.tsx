import {
  Add as AddIcon,
  BorderAll as BorderAllIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover
} from '@mui/material';
import { type Editor } from '@tiptap/core';
import { TextSelection } from 'prosemirror-state';
import React, { useEffect, useState } from 'react';
import { TableIcon } from '../icons/table-icon';
import EditorToolbarButton from './EditorToolbarButton';

const EditorTable = ({ editor }: { editor: Editor }) => {
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number } | null>(null);
  const [selectedCell, setSelectedCell] = useState<HTMLElement | null>(null);

  // 插入表格（支持自定义行列数）
  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 6, withHeaderRow: true })
      .run();
  };

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

  // 关闭菜单并重置样式
  const closeMenu = () => {
    setContextMenu(null);
    selectedCell?.style.removeProperty('background-color');
    setSelectedCell(null);
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
        {/* 插入操作 */}
        <MenuItem onClick={() => { tableOperations.insertColumnLeft(); closeMenu(); }}>
          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText>左侧插入列</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.insertColumnRight(); closeMenu(); }}>
          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText>右侧插入列</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.insertRowAbove(); closeMenu(); }}>
          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText>上方插入行</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.insertRowBelow(); closeMenu(); }}>
          <ListItemIcon><AddIcon fontSize="small" /></ListItemIcon>
          <ListItemText>下方插入行</ListItemText>
        </MenuItem>

        <Divider />

        {/* 删除操作 */}
        <MenuItem onClick={() => { tableOperations.deleteColumn(); closeMenu(); }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>删除当前列</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.deleteRow(); closeMenu(); }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>删除当前行</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.deleteTable(); closeMenu(); }}>
          <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>删除整个表格</ListItemText>
        </MenuItem>

        <Divider />

        {/* 单元格操作 */}
        {/* <MenuItem onClick={() => { tableOperations.mergeCells(); closeMenu(); }}>
          <ListItemIcon><ViewModuleIcon fontSize="small" /></ListItemIcon>
          <ListItemText>合并单元格</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.splitCell(); closeMenu(); }}>
          <ListItemIcon><ViewColumnIcon fontSize="small" /></ListItemIcon>
          <ListItemText>拆分单元格</ListItemText>
        </MenuItem>

        <Divider /> */}

        {/* 表头操作 */}
        <MenuItem onClick={() => { tableOperations.toggleHeaderRow(); closeMenu(); }}>
          <ListItemIcon><BorderAllIcon fontSize="small" /></ListItemIcon>
          <ListItemText>切换表头行</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { tableOperations.toggleHeaderColumn(); closeMenu(); }}>
          <ListItemIcon><BorderAllIcon fontSize="small" /></ListItemIcon>
          <ListItemText>切换表头列</ListItemText>
        </MenuItem>
      </Popover>
    </>
  );
};

export default EditorTable;
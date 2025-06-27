import { Divider, MenuItem, Popover } from '@mui/material';
import React from 'react';
import { TableContextMenuProps } from './types';
import { getTableCellInfo } from './utils';

const TableContextMenu: React.FC<TableContextMenuProps> = ({
  editor,
  contextMenu,
  onClose,
  operations,
}) => {
  const cellInfo = getTableCellInfo(editor);

  const menuItems = [
    {
      group: 'insert',
      items: [
        { label: '左侧插入列', action: operations.insertColumnLeft, icon: '⬅️', disabled: false },
        { label: '右侧插入列', action: operations.insertColumnRight, icon: '➡️', disabled: false },
        { label: '上方插入行', action: operations.insertRowAbove, icon: '⬆️', disabled: false },
        { label: '下方插入行', action: operations.insertRowBelow, icon: '⬇️', disabled: false },
      ],
    },
    // {
    //   group: 'merge',
    //   items: [
    //     {
    //       label: '合并单元格',
    //       action: operations.mergeCells,
    //       icon: '🔗',
    //       disabled: !cellInfo.canMerge,
    //     },
    //     {
    //       label: '拆分单元格',
    //       action: operations.splitCell,
    //       icon: '✂️',
    //       disabled: !cellInfo.canSplit,
    //     },
    //   ],
    // },
    {
      group: 'header',
      items: [
        { label: '切换表头行', action: operations.toggleHeaderRow, icon: '📋', disabled: false },
        { label: '切换表头列', action: operations.toggleHeaderColumn, icon: '📊', disabled: false },
      ],
    },
    {
      group: 'delete',
      items: [
        { label: '删除当前列', action: operations.deleteColumn, icon: '🗑️', disabled: false },
        { label: '删除当前行', action: operations.deleteRow, icon: '🗑️', disabled: false },
        { label: '删除表格', action: operations.deleteTable, icon: '🗑️', disabled: false },
      ],
    },
  ];

  const handleMenuClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Popover
      open={!!contextMenu && editor.isEditable}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        sx: {
          minWidth: 180,
          borderRadius: 'var(--mui-shape-borderRadius)',
          border: '1px solid var(--mui-palette-divider)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          py: 1,
        },
      }}
    >
      {menuItems.map((group, groupIndex) => (
        <React.Fragment key={group.group}>
          {groupIndex > 0 && <Divider sx={{ my: 1 }} />}
          {group.items.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => handleMenuClick(item.action)}
              disabled={item.disabled ?? false}
              sx={{
                px: 2,
                py: 1,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  backgroundColor: 'var(--mui-palette-background-paper)',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                },
              }}
            >
              <span style={{ width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </MenuItem>
          ))}
        </React.Fragment>
      ))}
    </Popover>
  );
};

export default TableContextMenu; 
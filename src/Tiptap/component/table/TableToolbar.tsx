import React from 'react';
import { TableIcon } from '../../icons/table-icon';
import EditorToolbarButton from '../EditorToolbarButton';
import { TableToolbarProps } from './types';

const TableToolbar: React.FC<TableToolbarProps> = ({ editor, onInsertTable }) => {
  return (
    <EditorToolbarButton
      tip="插入表格 (3×6，带表头)"
      icon={<TableIcon sx={{ fontSize: 17 }} />}
      onClick={onInsertTable}
      disabled={!editor.isEditable}
    />
  );
};

export default TableToolbar; 
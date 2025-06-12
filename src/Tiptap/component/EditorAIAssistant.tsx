import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Button, MenuItem, Popover } from '@mui/material';
import { type Editor } from '@tiptap/core';
import React, { useEffect, useState } from 'react';
import { AiIcon } from '../icons/ai-icon';

const EditorAIAssistant = ({ editor }: { editor: Editor }) => {
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPosition, setSelectionPosition] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);

      if (text && from !== to) {
        setSelectedText(text);
        // 获取选中文本的位置
        const { view } = editor;
        const start = view.coordsAtPos(from);
        const end = view.coordsAtPos(to);

        setSelectionPosition({
          left: end.left - 26,
          top: end.top - 200
        });
      } else {
        setSelectionPosition(null);
        setSelectedText('');
      }
    };

    editor.on('selectionUpdate', handleSelectionUpdate);

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate);
    };
  }, [editor]);

  const handleRephrase = () => {
    if (selectedText) {
      editor.chain().focus().aiRephrase({
        text: selectedText,
        stream: true,
      }).run();
    }
    setPopoverAnchor(null);
  };

  return (
    <>
      {selectionPosition && (
        <Button
          variant='contained'
          sx={{
            width: 32,
            height: 32,
            minWidth: 0,
            position: 'absolute',
            left: `${selectionPosition.left}px`,
            top: `${selectionPosition.top}px`,
            zIndex: 2000,
            padding: '4px',
          }}
          onClick={(e) => {
            e.preventDefault();
            setPopoverAnchor(e.currentTarget);
          }}
        >
          <AiIcon sx={{ fontSize: 16 }} />
        </Button>
      )}
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleRephrase}>
          <AutoFixHighIcon sx={{ mr: 1, fontSize: 16 }} />
          重写文本
        </MenuItem>
      </Popover>
    </>
  );
};

export default EditorAIAssistant; 
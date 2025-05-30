import { Box, Button, Grid, Popover, Stack } from '@mui/material';
import { type Editor } from '@tiptap/react';
import React, { useRef, useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import { HighlighterIcon } from "../icons/highlighter-icon";
import EditorToolbarButton from './EditorToolbarButton';

// 预设颜色列表
const PRESET_COLORS = [
  '#FFFFFF',
  '#FFE0B2',
  '#F8BBD0',
  '#FFCDD2',
  '#FFECB3',
  '#FFCCBC',
  '#B3E5FC',
  '#C8E6C9',
  '#B2EBF2',
  '#BBDEFB',
  '#DCEDC8',
  '#E1BEE7',
  '#F5F5F5',
  '#E0E0E0',
  '#FFFDE7',
  '#F3E5F5',
  '#CCFF90',
  '#FFD180',
  '#80D8FF',
  '#EA80FC',
];
const HighlightButton = ({ editor }: { editor: Editor }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customColor, setCustomColor] = useState('#FFEB3B');
  const buttonRef = useRef(null);

  const currentHighlight = editor.getAttributes('highlight').color;

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    if (color === currentHighlight) {
      editor.chain().focus().unsetHighlight().run();
    } else {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
    setAnchorEl(null);
  };

  const handleCustomColor = (color: string) => {
    setCustomColor(color);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'editor-highlight' : undefined;

  return (
    <>
      <EditorToolbarButton
        ref={buttonRef}
        tip={'高亮'}
        icon={<HighlighterIcon />}
        onClick={(e: any) => setAnchorEl(e.currentTarget)}
        className={editor.isActive("highlight") ? "active" : ""}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        disableRestoreFocus
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Box sx={{ p: 2 }}>
          <Grid container spacing={1} sx={{ mb: 2, width: 280 }}>
            {PRESET_COLORS.map((color) => (
              <Grid component="div" key={color}>
                <Box
                  onClick={() => handleColorSelect(color)}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    width: 18,
                    height: 18,
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: color,
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ '.react-colorful': { width: '100%', height: 200 } }}>
            <HexAlphaColorPicker color={customColor} onChange={handleCustomColor} />
            <Stack direction="row" alignItems="center" sx={{ mt: 1 }} justifyContent="space-between">
              <Box>{customColor}</Box>
              <Button size="small" variant="outlined" onClick={() => handleColorSelect(customColor)}>确定</Button>
            </Stack>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default HighlightButton
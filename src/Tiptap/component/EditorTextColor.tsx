import { Box, Button, Grid, Popover, Stack } from '@mui/material';
import { type Editor } from '@tiptap/react';
import React, { useRef, useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';
import { TextColorIcon } from '../icons/text-color-icon';
import EditorToolbarButton from './EditorToolbarButton';

const PRESET_COLORS = [
  '#000000',
  '#FF0000',
  '#008000',
  '#0000FF',
  '#FFA500',
  '#800080',
  '#FFC0CB',
  '#A52A2A',
  '#808080',
  '#FFFFFF',
];

const EditorTextColor = ({ editor }: { editor: Editor }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customColor, setCustomColor] = useState('#000000');
  const buttonRef = useRef(null);

  const currentColor = editor.getAttributes('textStyle').color;

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    if (color === currentColor) {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setAnchorEl(null);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'text-color-picker' : undefined;

  return (
    <>
      <EditorToolbarButton
        tip={'文字颜色'}
        ref={buttonRef}
        className={currentColor ? 'active' : ''}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        icon={<TextColorIcon sx={{ fontSize: 17, color: currentColor }} />}
        sx={{
          color: `${currentColor || 'inherit'} !important`,
        }}
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
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    backgroundColor: color,
                    border: color === '#FFFFFF' ? '1px solid #ddd' : 'none',
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ '.react-colorful': { width: '100%', height: 200 } }}>
            <HexAlphaColorPicker color={customColor} onChange={handleCustomColorChange} />
            <Stack direction="row" alignItems="center" sx={{ mt: 1 }} justifyContent="space-between">
              <Box>{customColor}</Box>
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleColorSelect(customColor)}
              >
                确定
              </Button>
            </Stack>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default EditorTextColor;
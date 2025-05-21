import { Box, MenuItem, Select } from '@mui/material';
import { Editor } from '@tiptap/core';
import React, { useEffect, useState } from 'react';
import { ArrowIcon } from '../icons/arrow-icon';
import EditorToolbarButton from './EditorToolbarButton';

const EditorFontSize = ({ editor }: { editor: Editor }) => {
  const defaultFontSize = 16;
  const [value, setValue] = useState(defaultFontSize);
  const Options = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60,]

  // 监听编辑器选择变化，更新字体大小
  useEffect(() => {
    const updateFontSize = () => {
      // 检查是否有heading标签
      if (editor.isActive('heading')) {
        const headingAttrs = editor.getAttributes('heading');
        const headingLevel = headingAttrs.level;
        // 根据heading级别设置对应的字体大小
        let headingFontSize = 16;
        switch (headingLevel) {
          case 1: headingFontSize = 28; break;
          case 2: headingFontSize = 24; break;
          case 3: headingFontSize = 20; break;
          case 4: headingFontSize = 18; break;
          case 5: headingFontSize = 16; break;
          case 6: headingFontSize = 14; break;
          default: headingFontSize = defaultFontSize;
        }
        setValue(headingFontSize);
      } else {
        // 如果不是heading，则使用textStyle的fontSize
        const attrs = editor.getAttributes('textStyle');
        const fontSize = attrs.fontSize || defaultFontSize;
        setValue(fontSize);
      }
    };

    editor.on('selectionUpdate', updateFontSize);
    editor.on('transaction', updateFontSize);

    return () => {
      editor.off('selectionUpdate', updateFontSize);
      editor.off('transaction', updateFontSize);
    };
  }, [editor]);

  return <Select
    value={value}
    className={editor.isActive('textStyle', { fontSize: value }) ? "active" : ""}
    onChange={(e) => {
      const value = Number(e.target.value);
      setValue(value);
      editor.chain().focus().setFontSize(value).run();
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: '300px'
        }
      }
    }}
    renderValue={(value) => {
      return <EditorToolbarButton
        tip={'字体大小'}
        icon={<Box sx={{ fontFamily: 'GMedium', width: '20px', fontSize: 15, mr: 0.5 }}>{value}</Box>}
      />
    }}
    IconComponent={({ className, ...rest }) => {
      return <ArrowIcon
        sx={{
          position: 'absolute',
          right: 0,
          fontSize: 14,
          flexShrink: 0,
          mr: 0,
          transform: className?.includes('MuiSelect-iconOpen') ? 'rotate(-180deg)' : 'none',
          transition: 'transform 0.3s',
          cursor: 'pointer',
          pointerEvents: 'none'
        }}
        {...rest}
      />
    }}
  >
    {Options.map(it => <MenuItem key={it} value={it}>
      <Box sx={{ ml: 0.5, fontFamily: 'GMedium' }}>{it}px</Box>
    </MenuItem>)}
  </Select>
}

export default EditorFontSize;
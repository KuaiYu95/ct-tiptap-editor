import { Box, MenuItem, Select, Tooltip } from "@mui/material";
import { type Editor } from "@tiptap/react";
import { getShortcutKeyText } from "ct-tiptap-editor/utils";
import React, { useEffect, useState } from "react";
import { AlignCenterIcon } from "../icons/align-center-icon";
import { AlignJustifyIcon } from "../icons/align-justify-icon";
import { AlignLeftIcon } from "../icons/align-left-icon";
import { AlignRightIcon } from "../icons/align-right-icon";
import { ArrowIcon } from "../icons/arrow-icon";
import EditorToolbarButton from "./EditorToolbarButton";

const EditorAlign = ({ editor }: { editor: Editor }) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const AlignOptions = [
    { id: 'left', icon: <AlignLeftIcon />, label: '左对齐', shortcutKey: ['ctrl', 'L'] },
    { id: 'center', icon: <AlignCenterIcon />, label: '居中对齐', shortcutKey: ['ctrl', 'E'] },
    { id: 'right', icon: <AlignRightIcon />, label: '右对齐', shortcutKey: ['ctrl', 'R'] },
    { id: 'justify', icon: <AlignJustifyIcon />, label: '两端对齐', shortcutKey: ['ctrl', 'J'] },
  ];

  const updateSelection = () => {
    if (editor.isActive({ textAlign: 'left' })) {
      setSelectedValue('left');
    } else if (editor.isActive({ textAlign: 'center' })) {
      setSelectedValue('center');
    } else if (editor.isActive({ textAlign: 'right' })) {
      setSelectedValue('right');
    } else if (editor.isActive({ textAlign: 'justify' })) {
      setSelectedValue('justify');
    } else {
      setSelectedValue('none');
    }
  };

  useEffect(() => {
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);

    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor]);

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;

    editor.chain().focus().setTextAlign(value).run();
    setSelectedValue(value);
  };

  return <Select
    value={selectedValue}
    className={['left', 'center', 'right', 'justify'].includes(selectedValue) ? "active" : ""}
    onChange={handleChange}
    renderValue={(value) => {
      return <EditorToolbarButton
        tip={'对齐'}
        icon={<Box sx={{ mr: 0.5 }}>
          {AlignOptions.find(it => it.id === value)?.icon || <AlignLeftIcon />}
        </Box>}
      />;
    }}
    IconComponent={({ className, ...rest }) => {
      return (
        <ArrowIcon
          sx={{
            position: 'absolute',
            right: 0,
            flexSelf: 'center',
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
      );
    }}
  >
    <MenuItem key={'none'} value={'none'} sx={{ display: 'none' }}>
      <AlignLeftIcon />
      <Box sx={{ ml: 0.5 }}>无</Box>
    </MenuItem>
    {AlignOptions.map(it => {
      return <Tooltip title={<Box>
        {getShortcutKeyText(it.shortcutKey || [])}
      </Box>} key={it.id} placement="right" arrow>
        <MenuItem key={it.id} value={it.id}>
          {it.icon}
          <Box sx={{ ml: 0.5 }}>{it.label}</Box>
        </MenuItem>
      </Tooltip>
    })}
  </Select>
}

export default EditorAlign
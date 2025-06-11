import { Box, MenuItem, Select, Stack, Tooltip } from "@mui/material";
import { type Editor } from "@tiptap/react";
import { getShortcutKeyText } from "ct-tiptap-editor/utils";
import React, { useEffect, useState } from "react";
import { AlignLeftIcon } from "../icons/align-left-icon";
import { ArrowIcon } from "../icons/arrow-icon";
import { CodeBlockIcon } from "../icons/code-block-icon";
import { Code2Icon } from "../icons/code2-icon";
import EditorToolbarButton from "./EditorToolbarButton";

const EditorCode = ({ editor }: { editor: Editor }) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const CodeOptions = [
    { id: 'code', icon: <Code2Icon />, label: '代码', shortcutKey: ['ctrl', 'E'] },
    { id: 'codeBlock', icon: <CodeBlockIcon />, label: '代码块', shortcutKey: ['ctrl', 'L'] },
  ];

  const updateSelection = () => {
    if (editor.isActive("code")) {
      setSelectedValue('code');
    } else if (editor.isActive("codeBlock")) {
      setSelectedValue('codeBlock');
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
    if (value === 'code') {
      editor.chain().focus().toggleCode().run();
    } else if (value === 'codeBlock') {
      editor.chain().focus().toggleCodeBlock().run();
    }
    setSelectedValue(value);
  };

  return <Select
    value={selectedValue}
    className={['code', 'codeBlock'].includes(selectedValue) ? "active" : ""}
    onChange={handleChange}
    renderValue={(value) => {
      return <EditorToolbarButton
        tip={'代码'}
        icon={<Stack direction={'row'} alignItems={'center'} justifyContent='center' sx={{ mr: 0.5 }}>
          {CodeOptions.find(it => it.id === value)?.icon || <Code2Icon />}
        </Stack>}
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
    {CodeOptions.map(it => {
      return <MenuItem key={it.id} value={it.id}>
        <Tooltip title={<Box>
          {getShortcutKeyText(it.shortcutKey || [])}
        </Box>} key={it.id} placement="right" arrow>
          <Stack direction={'row'} alignItems={'center'} gap={0.5}>
            {it.icon}
            <Box>{it.label}</Box>
          </Stack>
        </Tooltip>
      </MenuItem>
    })}
  </Select>
}

export default EditorCode
import { Box, MenuItem, Select, Stack } from "@mui/material";
import { type Editor } from "@tiptap/react";
import { Message } from "ct-mui";
import React from "react";
import { AiIcon } from "../icons/ai-icon";
import { ArrowIcon } from "../icons/arrow-icon";
import EditorToolbarButton from "./EditorToolbarButton";

interface EditorAIAssistantProps {
  editor: Editor
  onAi?: (text: string, action: string) => Promise<string>
}

const EditorAIAssistant = ({ editor, onAi }: EditorAIAssistantProps) => {
  const UploadOptions = [
    { id: 'rephrase', label: '重新润色' },
  ];
  const handleChange = async (e: { target: { value: string } }) => {
    if (!onAi) {
      Message.error('未配置 AI 回调')
      return
    }
    const value = e.target.value;
    if (value === 'rephrase') {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to, "\n");
      if (!selectedText) {
        Message.error('请先选择文本')
        return
      }
      const result = await onAi(selectedText, 'rephrase')
      console.log(result)
    }
  };

  return <>
    <Select
      value={'none'}
      onChange={handleChange}
      renderValue={() => {
        return <EditorToolbarButton
          tip={'AI'}
          icon={<Stack direction={'row'} alignItems={'center'} justifyContent='center' sx={{ mr: 0.5 }}>
            <AiIcon sx={{ fontSize: 14 }} />
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
        <AiIcon sx={{ fontSize: 14 }} />
        <Box sx={{ ml: 0.5 }}>无</Box>
      </MenuItem>
      {UploadOptions.map(it => {
        return <MenuItem key={it.id} value={it.id}>
          <Stack direction={'row'} alignItems={'center'} gap={0.5}>
            <Box>{it.label}</Box>
          </Stack>
        </MenuItem>
      })}
    </Select>
  </>
}

export default EditorAIAssistant
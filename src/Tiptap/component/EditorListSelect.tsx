import { Box, MenuItem, Select, Stack } from "@mui/material";
import { type Editor } from "@tiptap/react";
import React, { useEffect, useState } from "react";
import { ArrowIcon } from "../icons/arrow-icon";
import { ListIcon } from "../icons/list-icon";
import { ListOrderedIcon } from "../icons/list-ordered-icon";
import { ListTodoIcon } from "../icons/list-todo-icon";
import EditorToolbarButton from "./EditorToolbarButton";

const EditorListSelect = ({ editor }: { editor: Editor }) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");

  const ListOptions = [
    { id: 'bulletList', icon: <ListIcon />, label: '无序列表' },
    { id: 'orderedList', icon: <ListOrderedIcon />, label: '有序列表' },
    { id: 'taskList', icon: <ListTodoIcon />, label: '任务列表' },
  ];

  // 更新选中状态的函数
  const updateSelection = () => {
    if (editor.isActive('orderedList')) {
      setSelectedValue('orderedList');
    } else if (editor.isActive('taskList')) {
      setSelectedValue('taskList');
    } else if (editor.isActive('bulletList')) {
      setSelectedValue('bulletList');
    } else {
      setSelectedValue('none');
    }
  };

  // 监听编辑器变化
  useEffect(() => {
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);

    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor]);

  const handleChange = (value: string) => {

    // 先清除所有列表类型
    if (editor.isActive('orderedList') && value === 'orderedList') {
      editor.chain().focus().toggleOrderedList().run();
    } else if (editor.isActive('taskList') && value === 'taskList') {
      editor.chain().focus().toggleTaskList().run();
    } else if (editor.isActive('bulletList') && value === 'bulletList') {
      editor.chain().focus().toggleBulletList().run();
    } else if (value === 'orderedList') {
      editor.chain().focus().toggleOrderedList().run();
    } else if (value === 'taskList') {
      editor.chain().focus().toggleTaskList().run();
    } else if (value === 'bulletList') {
      editor.chain().focus().toggleBulletList().run();
    }
  };

  return (
    <Select
      value={selectedValue}
      className={['orderedList', 'taskList', 'bulletList'].includes(selectedValue) ? "active" : ""}
      onChange={(e) => setSelectedValue(e.target.value)}
      renderValue={(value) => {
        return <EditorToolbarButton
          tip={'列表'}
          icon={<Stack direction={'row'} alignItems={'center'} justifyContent='center' sx={{ mr: 0.5 }}>
            {ListOptions.find(it => it.id === value)?.icon || <ListIcon />}
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
        <ListIcon />
        <Box sx={{ ml: 0.5 }}>无</Box>
      </MenuItem>
      {ListOptions.map(it => (
        <MenuItem key={it.id} value={it.id} onClick={() => handleChange(it.id)}>
          {it.icon}
          <Box sx={{ ml: 0.5 }}>{it.label}</Box>
        </MenuItem>
      ))}
    </Select>
  );
};

export default EditorListSelect;
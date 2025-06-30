import { Box, MenuItem, Select, Stack } from "@mui/material";
import { type Editor } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import { UploadFunction } from "../extension/VideoUploadExtension";
import { AlignLeftIcon } from "../icons/align-left-icon";
import { ArrowIcon } from "../icons/arrow-icon";
import { AttachmentIcon } from "../icons/attachment-icon";
import { ImagePlusIcon } from "../icons/image-plus-icon";
import { UploadIcon } from "../icons/upload-icon";
import { VideoIcon } from "../icons/video-icon";
import EditorToolbarButton from "./EditorToolbarButton";

interface EditorUploadProps {
  editor: Editor
  onUpload?: UploadFunction
}

const EditorUpload = ({ editor, onUpload }: EditorUploadProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");
  const fileInputRef = useRef<HTMLInputElement>(null)

  const UploadOptions = [
    { id: 'image', icon: <ImagePlusIcon />, label: '上传图片' },
    { id: 'video', icon: <VideoIcon sx={{ fontSize: 18 }} />, label: '上传视频' },
    { id: 'file', icon: <AttachmentIcon sx={{ fontSize: 17 }} />, label: '上传附件' },
  ];

  const inputFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;

    try {
      const fileUrl = await onUpload(file);
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${fileUrl}" download="${file.name}">📎 ${file.name}</a>`)
        .run();
    } catch (error) {
      console.error('文件上传失败:', error);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = React.useCallback((e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (!e.defaultPrevented) {
      editor
        .chain()
        .focus()
        .setImageUploadNode()
        .run()
    }
  }, [editor])

  const handleVideoClick = React.useCallback((e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    if (!e.defaultPrevented) {
      editor
        .chain()
        .focus()
        .setVideoUploadNode()
        .run()
    }
  }, [editor])

  const updateSelection = () => {
    if (editor.isActive('imageUpload')) {
      setSelectedValue('image');
    } else if (editor.isActive('videoUpload')) {
      setSelectedValue('video');
    } else if (editor.isActive('fileUpload')) {
      setSelectedValue('file');
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

  const handleChange = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, value: string) => {
    if (value === 'image') {
      handleImageClick(e)
    } else if (value === 'video') {
      handleVideoClick(e)
    } else if (value === 'file') {
      fileInputRef.current?.click()
    }
  };

  return <>
    <Select
      value={selectedValue}
      className={['image', 'video', 'file'].includes(selectedValue) ? "active" : ""}
      onChange={(e) => setSelectedValue(e.target.value)}
      renderValue={(value) => {
        return <EditorToolbarButton
          tip={'上传'}
          icon={<Stack direction={'row'} alignItems={'center'} justifyContent='center' sx={{ mr: 0.5 }}>
            {UploadOptions.find(it => it.id === value)?.icon || <UploadIcon sx={{ fontSize: 16 }} />}
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
      {UploadOptions.map(it => {
        return <MenuItem key={it.id} value={it.id} onClick={(e) => handleChange(e, it.id)}>
          <Stack direction={'row'} alignItems={'center'} gap={0.5}>
            {it.icon}
            <Box>{it.label}</Box>
          </Stack>
        </MenuItem>
      })}
    </Select>
    <input
      type='file'
      ref={fileInputRef}
      hidden
      accept='*/*'
      multiple={false}
      onChange={inputFile}
    />
  </>
}

export default EditorUpload;
import { Box, MenuItem, Select, Stack } from "@mui/material";
import { type Editor } from "@tiptap/react";
import React, { useEffect, useRef, useState } from "react";
import { UploadFunction } from "../extension/VideoUpload";
import { AlignLeftIcon } from "../icons/align-left-icon";
import { ArrowIcon } from "../icons/arrow-icon";
import { AttachmentIcon } from "../icons/attachment-icon";
import { ImagePlusIcon } from "../icons/image-plus-icon";
import { UploadIcon } from "../icons/upload-icon";
import { VideoIcon } from "../icons/video-icon";
import EditorToolbarButton from "./EditorToolbarButton";
import { useVideoUploadButton } from "./EditorVideo";

interface EditorUploadProps {
  editor: Editor
  extensionName?: string
  onUpload?: UploadFunction
  imgEdit: (files: File) => void
}

const EditorUpload = ({ editor, extensionName, imgEdit, onUpload }: EditorUploadProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");
  const imgInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const UploadOptions = [
    { id: 'image', icon: <ImagePlusIcon />, label: '上传图片' },
    { id: 'video', icon: <VideoIcon sx={{ fontSize: 18 }} />, label: '上传视频' },
    { id: 'file', icon: <AttachmentIcon sx={{ fontSize: 17 }} />, label: '上传附件' },
  ];

  const { isActive, handleInsertVideo } = useVideoUploadButton(
    editor,
    extensionName || 'videoUpload',
  )

  const inputImg = (files: File[]) => {
    const file = files[0];
    imgEdit(file);
  }

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

  const handleVideoClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.defaultPrevented) handleInsertVideo()
  }, [handleInsertVideo])

  const updateSelection = () => {
    if (editor.isActive('image')) {
      setSelectedValue('image');
    } else if (editor.isActive('video')) {
      setSelectedValue('video');
    } else if (editor.isActive('file')) {
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

  const handleChange = (e: { target: { value: string } }) => {
    const value = e.target.value;

    if (value === 'image') {
      imgInputRef.current?.click()
    } else if (value === 'video') {
      handleVideoClick(e as any)
    } else if (value === 'file') {
      fileInputRef.current?.click()
    }
    setSelectedValue(value);
  };

  return <>
    <Select
      value={selectedValue}
      className={['image', 'video', 'file'].includes(selectedValue) ? "active" : ""}
      onChange={handleChange}
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
        return <MenuItem key={it.id} value={it.id}>
          <Stack direction={'row'} alignItems={'center'} gap={0.5}>
            {it.icon}
            <Box>{it.label}</Box>
          </Stack>
        </MenuItem>
      })}
    </Select>
    <input
      type='file'
      ref={imgInputRef}
      hidden
      accept='image/*'
      multiple={false}
      onChange={e => {
        if (e.target.files) {
          inputImg(Array.from(e.target.files))
        }
      }}
    />
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

export default EditorUpload
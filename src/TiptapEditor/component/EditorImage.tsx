import { Upload as UploadIcon } from '@mui/icons-material';
import { Box, Button, Popover } from "@mui/material";
import React, { useRef, useState } from "react";
import { ImagePlusIcon } from "../icons/image-plus-icon";
import EditorToolbarButton from "./EditorToolbarButton";

const EditorImage = ({ onUpload }: { onUpload: (files: File, callback: () => void) => void }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const open = Boolean(anchorEl);
  const id = open ? 'eidtor-image' : undefined;

  const callback = () => {
    setAnchorEl(null);
  }

  const onChange = (files: File[]) => {
    const file = files[0];
    onUpload(file, callback);
  }

  return <>
    <EditorToolbarButton
      tip={'图片'}
      ref={buttonRef}
      onClick={(e) => setAnchorEl(e.currentTarget)}
      icon={<ImagePlusIcon />}
    />
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Button
          variant='outlined'
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
        >
          选择文件
        </Button>
        <input
          type='file'
          ref={fileInputRef}
          hidden
          accept='image/*'
          multiple={false}
          onChange={e => {
            if (e.target.files) {
              onChange(Array.from(e.target.files))
            }
          }}
        />
      </Box>
    </Popover>
  </>
}

export default EditorImage;
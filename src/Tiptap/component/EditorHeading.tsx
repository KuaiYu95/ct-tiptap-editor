import { Box, MenuItem, Select } from "@mui/material";
import { type Editor } from "@tiptap/react";
import React from "react";
import { ArrowIcon } from "../icons/arrow-icon";
import { HeadingFiveIcon } from "../icons/heading-five-icon";
import { HeadingFourIcon } from "../icons/heading-four-icon";
import { HeadingIcon } from "../icons/heading-icon";
import { HeadingOneIcon } from "../icons/heading-one-icon";
import { HeadingSixIcon } from "../icons/heading-six-icon";
import { HeadingThreeIcon } from "../icons/heading-three-icon";
import { HeadingTwoIcon } from "../icons/heading-two-icon";
import EditorToolbarButton from "./EditorToolbarButton";

const EditorHeading = ({ editor }: { editor: Editor }) => {
  const HeadingOptions = [
    { id: 'paragraph', icon: <HeadingIcon />, label: 'Paragraph' },
    { id: '1', icon: <HeadingOneIcon />, label: 'Heading 1' },
    { id: '2', icon: <HeadingTwoIcon />, label: 'Heading 2' },
    { id: '3', icon: <HeadingThreeIcon />, label: 'Heading 3' },
    { id: '4', icon: <HeadingFourIcon />, label: 'Heading 4' },
    { id: '5', icon: <HeadingFiveIcon />, label: 'Heading 5' },
    { id: '6', icon: <HeadingSixIcon />, label: 'Heading 6' },
  ]
  return <Select
    value={editor.getAttributes("heading").level || "paragraph"}
    className={editor.isActive('heading') ? "active" : ""}
    onChange={(e) => {
      const value = e.target.value;
      if (value !== 'paragraph') {
        const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
        const id = `h${level}-${new Date().getTime().toString()}`;
        // @ts-ignore
        editor.chain().focus().toggleHeading({ level, id }).run();
      } else {
        editor.chain().focus().setParagraph().run();
      }
    }}
    renderValue={(value) => {
      return <EditorToolbarButton
        tip={'标题'}
        icon={HeadingOptions.find(it => it.id == value)?.icon || <HeadingIcon />}
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
    {HeadingOptions.map(it => <MenuItem key={it.id} value={it.id}>
      {it.icon}
      <Box sx={{ ml: 0.5 }}>{it.label}</Box>
    </MenuItem>)}
  </Select>
}

export default EditorHeading
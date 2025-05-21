import { Theme } from "@emotion/react";
import { Box, Button, Stack, SxProps, Tooltip } from "@mui/material";
import React from "react";
import { getShortcutKeyText } from "react-tiptap-editor/utils";


interface EditorToolbarButtonProps {
  tip: string;
  shortcutKey?: string[];
  sx?: SxProps<Theme>;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  [key: string]: any;
}

const EditorToolbarButton = ({ tip, shortcutKey, icon, sx, onClick, ...rest }: EditorToolbarButtonProps) => {
  const shortcutKeyText = getShortcutKeyText(shortcutKey || []);
  return (
    <Tooltip title={
      <Stack alignItems="center">
        <Box>{tip}</Box>
        {shortcutKeyText && <Box sx={{ fontSize: 12 }}>{shortcutKeyText}</Box>}
      </Stack>
    } arrow>
      <Box>
        <Button onClick={onClick} sx={{ ...sx, textTransform: 'none' }} {...rest} >
          {icon}
        </Button>
      </Box>
    </Tooltip>
  )
}

export default EditorToolbarButton;
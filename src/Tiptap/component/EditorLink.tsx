import {
  Box,
  Divider,
  IconButton,
  Popover,
  Stack,
  TextField
} from '@mui/material';
import { type Editor } from '@tiptap/react';
import React, { useRef, useState } from 'react';
import { CornerDownLeftIcon } from '../icons/corner-down-left-icon';
import { ExternalLinkIcon } from '../icons/external-link-icon';
import { LinkIcon } from '../icons/link-icon';
import { TrashIcon } from '../icons/trash-icon';
import EditorToolbarButton from './EditorToolbarButton';

const EditorLink = ({ editor }: { editor: Editor }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleManualOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { href = '' } = editor.getAttributes('link');
    setUrl(href);
    setAnchorEl(buttonRef.current);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (editor.isActive('link')) {
      editor.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }

    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '');

    if (selectedText) {
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContent({
          type: 'text',
          text: selectedText,
          marks: [{
            type: 'link',
            attrs: {
              href: url,
            }
          }]
        }).run();
    } else {
      editor.chain().focus().insertContent({
        type: 'text',
        text: url,
        marks: [{
          type: 'link',
          attrs: {
            href: url,
          }
        }]
      }).run();
    }

    setAnchorEl(null);
  };

  const handleRemove = () => {
    editor.chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run();
    setAnchorEl(null);
    setUrl('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'editor-link' : undefined;

  return (
    <>
      <EditorToolbarButton
        tip={'链接'}
        icon={<LinkIcon />}
        ref={buttonRef}
        onClick={handleManualOpen}
        className={editor.isActive('link') ? 'active' : ''}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
          setUrl('');
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 500 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="URL"
              value={url}
              autoFocus
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com"
              slotProps={{
                input: {
                  endAdornment: <Stack direction="row" spacing={1} justifyContent="flex-end" onClick={(e) => {
                    e.stopPropagation();
                  }}>
                    <IconButton type="submit" size="small" sx={{ minWidth: '36px', height: 36, p: 0, color: 'text.auxiliary' }}>
                      <CornerDownLeftIcon />
                    </IconButton>
                    <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />
                    <IconButton size="small" sx={{ minWidth: '36px', height: 36, p: 0, color: 'text.auxiliary' }} onClick={() => {
                      window.open(url, '_blank');
                    }}>
                      <ExternalLinkIcon />
                    </IconButton>
                    {editor.isActive('link') && (
                      <IconButton size="small" sx={{ minWidth: '36px', height: 36, p: 0, color: 'text.auxiliary' }} onClick={handleRemove}>
                        <TrashIcon />
                      </IconButton>
                    )}
                  </Stack>
                }
              }}
            />
          </form>
        </Box>
      </Popover>
    </>
  );
};

export default EditorLink;
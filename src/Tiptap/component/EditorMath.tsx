import { Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Editor } from '@tiptap/core';
import katex from 'katex';
import React, { useMemo, useState } from 'react';
import { ArrowIcon } from '../icons/arrow-icon';
import { MathIcon } from '../icons/math-icon';
import EditorToolbarButton from './EditorToolbarButton';

const EditorMath = ({ editor }: { editor: Editor }) => {
  const [selectedValue, setSelectedValue] = useState<string>("none");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mathInput, setMathInput] = useState('');
  const [isBlockMode, setIsBlockMode] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setMathInput('');
    setSelectedValue("none");
  };

  const insertMathFormula = () => {
    if (mathInput.trim()) {
      if (isBlockMode) {
        // 插入块级数学公式
        editor.chain().focus().insertContent(`\n$$${mathInput}$$\n`).run();
      } else {
        // 插入内联数学公式
        editor.chain().focus().insertContent(`$${mathInput}$ `).run();
      }
      handleDialogClose();
    }
  };

  // 实时预览渲染的数学公式
  const previewHtml = useMemo(() => {
    if (!mathInput.trim()) return null;
    try {
      return katex.renderToString(mathInput, {
        throwOnError: false,
        displayMode: isBlockMode,
        output: 'html',
        strict: false,
      });
    } catch (error) {
      return null;
    }
  }, [mathInput, isBlockMode]);

  // 数学公式选项
  const mathOptions = [
    { id: 'inline', label: '内联公式', action: 'inline' },
    { id: 'block', label: '块级公式', action: 'block' },
    { id: 'fraction', label: '分数', formula: '\\frac{a}{b}' },
    { id: 'sqrt', label: '根号', formula: '\\sqrt{x}' },
    { id: 'integral', label: '积分', formula: '\\int_{a}^{b} f(x) dx' },
    { id: 'sum', label: '求和', formula: '\\sum_{i=1}^{n} x_i' },
    { id: 'limit', label: '极限', formula: '\\lim_{x \\to \\infty} f(x)' },
    { id: 'matrix', label: '矩阵', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { id: 'greek', label: '希腊字母', formula: '\\alpha \\beta \\gamma \\delta' },
    { id: 'superscript', label: '上下标', formula: 'x^{2} + y_{1}' },
  ];

  const handleChange = (value: string) => {
    const option = mathOptions.find(opt => opt.id === value);
    if (!option) return;

    if (option.action === 'inline') {
      setIsBlockMode(false);
      setDialogOpen(true);
      setMathInput('');
    } else if (option.action === 'block') {
      setIsBlockMode(true);
      setDialogOpen(true);
      setMathInput('');
    } else if (option.formula) {
      setMathInput(option.formula);
      setIsBlockMode(false);
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Select
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        renderValue={() => {
          return <EditorToolbarButton
            tip={'数学公式'}
            icon={<Stack direction={'row'} alignItems={'center'} justifyContent='center' sx={{ mr: 0.5 }}>
              <MathIcon sx={{ fontSize: 15 }} />
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
          <Box sx={{ ml: 0.5 }}>无</Box>
        </MenuItem>
        {mathOptions.map(option => {
          if (option.action === 'divider') {
            return <MenuItem key={option.id} disabled sx={{ borderTop: '1px solid', borderColor: 'divider', my: 0.5 }}>---</MenuItem>;
          }
          return (
            <MenuItem key={option.id} value={option.id} onClick={() => handleChange(option.id)}>
              <Box sx={{ ml: 0.5 }}>{option.label}</Box>
            </MenuItem>
          );
        })}
      </Select>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>插入数学公式 - {isBlockMode ? '块级公式' : '内联公式'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="LaTeX 公式"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={mathInput}
            onChange={(e) => setMathInput(e.target.value)}
            placeholder="请输入 LaTeX 格式的数学公式，例如: x^2 + y^2 = r^2"
            helperText="提示：您也可以直接在编辑器中输入 $公式$ 格式的内联数学公式，或 $$公式$$ 格式的块级数学公式"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                insertMathFormula();
              }
            }}
          />

          {/* 实时预览 */}
          {mathInput.trim() && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                预览效果：
              </Typography>
              {previewHtml ? (
                <Box
                  sx={{ fontSize: '1.1em' }}
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <Typography color="error" variant="body2">
                  公式语法错误，请检查输入
                </Typography>
              )}
            </Box>
          )}
          <Stack direction={'row'} justifyContent={'flex-end'} spacing={2} sx={{ mt: 2 }}>
            <Button
              onClick={handleDialogClose}
            >
              取消
            </Button>
            <Button
              onClick={insertMathFormula}
              variant='contained'
            >
              插入公式
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditorMath; 
import { Editor } from '@tiptap/core';
import { TableCellInfo } from './types';

/**
 * 检查当前选中的单元格信息
 */
export const getTableCellInfo = (editor: Editor): TableCellInfo => {
  const { selection } = editor.state;
  const { $from } = selection;

  // 检查是否在表格中
  const tableDepth = $from.depth;
  let isInTable = false;
  let isInHeader = false;

  for (let i = tableDepth; i >= 0; i--) {
    const node = $from.node(i);
    if (node.type.name === 'table') {
      isInTable = true;
      break;
    }
    if (node.type.name === 'tableHeader') {
      isInHeader = true;
    }
  }

  if (!isInTable) {
    return {
      canMerge: false,
      canSplit: false,
      isInHeader: false,
      isMultiSelection: false,
    };
  }

  // 检查是否可以合并单元格（选中了多个单元格）
  const canMerge = editor.can().mergeCells();

  // 检查是否可以拆分单元格
  const canSplit = editor.can().splitCell();

  // 检查是否是多选状态（选中了多个单元格）
  // CellSelection 表示选中了多个单元格
  const isMultiSelection = selection.constructor.name === 'CellSelection' && canMerge;

  return {
    canMerge,
    canSplit,
    isInHeader,
    isMultiSelection,
  };
};

/**
 * 清理单元格多选样式
 */
export const clearMultiSelectedCells = (editor: Editor): void => {
  const tables = editor.options.element.querySelectorAll('table');
  tables.forEach(table => {
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      const element = cell as HTMLElement;
      const currentClass = element.getAttribute('class') || '';
      const newClass = currentClass.replace(/\s*multi-selected-cell\s*/g, ' ').trim();

      if (newClass !== currentClass) {
        element.setAttribute('class', newClass);
      }
      element.classList.remove('multi-selected-cell');
      element.removeAttribute('data-multi-selected');
    });
  });
};

/**
 * 为表格添加样式类
 */
export const addTableStyles = (editor: Editor): void => {
  const tables = editor.options.element.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.classList.contains('editor-table')) {
      table.classList.add('editor-table');
    }
    // 添加编辑状态类
    if (editor.isEditable && !table.classList.contains('editor-table-edit')) {
      table.classList.add('editor-table-edit');
      table.classList.remove('editor-table-read');
    } else if (!editor.isEditable && !table.classList.contains('editor-table-read')) {
      table.classList.add('editor-table-read');
      table.classList.remove('editor-table-edit');
    }
  });

  // 处理多选单元格样式
  updateMultiSelectedCells(editor);

  // 维持多选样式
  maintainMultiSelectedStyles(editor);
};

/**
 * 更新多选单元格的样式
 */
export const updateMultiSelectedCells = (editor: Editor): void => {
  const { selection } = editor.state;

  // 清除所有现有的多选样式
  clearMultiSelectedCells(editor);

  // 检查是否是多选状态并且可以合并
  const canMerge = editor.can().mergeCells();
  if (canMerge && selection.constructor.name === 'CellSelection') {
    try {
      // 使用Tiptap的CellSelection API来获取选中的单元格
      const cellSelection = selection as any;
      const selectedCells: { cell: any; pos: number; domNode: HTMLElement }[] = [];

      if (cellSelection.forEachCell) {
        // 先收集所有选中的单元格信息
        cellSelection.forEachCell((cell: any, cellPos: number) => {
          try {
            // 从文档位置获取对应的DOM节点
            const domNode = editor.view.nodeDOM(cellPos);
            if (domNode && domNode.nodeType === Node.ELEMENT_NODE) {
              const element = domNode as HTMLElement;
              if (element.tagName === 'TD' || element.tagName === 'TH') {
                selectedCells.push({ cell, pos: cellPos, domNode: element });
              }
            }
          } catch (e) {
            // 忽略个别单元格的错误
          }
        });

        // 如果有选中的单元格，更新它们的样式
        if (selectedCells.length > 0) {
          selectedCells.forEach(({ cell, pos, domNode }) => {
            // 更新DOM样式
            const currentClass = domNode.getAttribute('class') || '';
            const newClass = currentClass.includes('multi-selected-cell')
              ? currentClass
              : `${currentClass} multi-selected-cell`.trim();

            domNode.setAttribute('class', newClass);
            domNode.classList.add('multi-selected-cell');

            // 添加一个数据属性来标记这是多选单元格
            domNode.setAttribute('data-multi-selected', 'true');
          });

          // 设置一个延迟任务来确保样式保持
          requestAnimationFrame(() => {
            setTimeout(() => {
              maintainMultiSelectedStyles(editor);
            }, 50);
          });
        }
      } else {
        // 备用方案：基于位置范围查找
        const tables = editor.options.element.querySelectorAll('table');
        tables.forEach(table => {
          const cells = table.querySelectorAll('td, th');
          cells.forEach(cell => {
            try {
              const cellPos = editor.view.posAtDOM(cell, 0);
              if (cellPos >= selection.from && cellPos < selection.to) {
                const element = cell as HTMLElement;
                const currentClass = element.getAttribute('class') || '';
                const newClass = currentClass.includes('multi-selected-cell')
                  ? currentClass
                  : `${currentClass} multi-selected-cell`.trim();

                element.setAttribute('class', newClass);
                element.classList.add('multi-selected-cell');
                element.setAttribute('data-multi-selected', 'true');
              }
            } catch (e) {
              // 忽略错误
            }
          });
        });
      }
    } catch (error) {
      console.warn('Failed to update multi-selected cells:', error);
    }
  }
};

/**
 * 维持多选单元格的样式，防止被编辑器重置
 */
export const maintainMultiSelectedStyles = (editor: Editor): void => {
  const { selection } = editor.state;

  // 只在CellSelection时维持样式
  if (selection.constructor.name === 'CellSelection') {
    const tables = editor.options.element.querySelectorAll('table');
    tables.forEach(table => {
      const cells = table.querySelectorAll('td[data-multi-selected="true"], th[data-multi-selected="true"]');
      cells.forEach(cell => {
        const element = cell as HTMLElement;
        const currentClass = element.getAttribute('class') || '';

        // 如果样式被移除了，重新添加
        if (!currentClass.includes('multi-selected-cell')) {
          const newClass = `${currentClass} multi-selected-cell`.trim();
          element.setAttribute('class', newClass);
          element.classList.add('multi-selected-cell');
        }
      });
    });
  } else {
    // 如果不是CellSelection，清除所有标记
    const tables = editor.options.element.querySelectorAll('table');
    tables.forEach(table => {
      const cells = table.querySelectorAll('td[data-multi-selected="true"], th[data-multi-selected="true"]');
      cells.forEach(cell => {
        const element = cell as HTMLElement;
        element.removeAttribute('data-multi-selected');
        const currentClass = element.getAttribute('class') || '';
        const newClass = currentClass.replace(/\s*multi-selected-cell\s*/g, ' ').trim();
        if (newClass !== currentClass) {
          element.setAttribute('class', newClass);
          element.classList.remove('multi-selected-cell');
        }
      });
    });
  }
};

/**
 * 检查点击的元素是否是表格单元格
 */
export const getTableCell = (target: HTMLElement): HTMLElement | null => {
  return target.closest('td, th');
};

/**
 * 设置单元格选中状态
 */
export const setCellSelected = (
  cell: HTMLElement | null,
  previousCell: HTMLElement | null
): HTMLElement | null => {
  // 移除之前选中单元格的样式
  if (previousCell) {
    previousCell.style.removeProperty('background-color');
    previousCell.classList.remove('selected-cell');
  }

  // 设置新选中单元格的样式
  if (cell) {
    cell.style.backgroundColor = 'var(--mui-palette-primary-light)';
    cell.style.opacity = '0.1';
    cell.classList.add('selected-cell');
  }

  return cell;
};

/**
 * 获取表格的基本信息
 */
export const getTableInfo = (editor: Editor) => {
  const { selection } = editor.state;
  const { $from } = selection;

  let tableNode = null;
  let tablePos = -1;

  // 查找包含当前选区的表格节点
  for (let depth = $from.depth; depth >= 0; depth--) {
    const node = $from.node(depth);
    if (node.type.name === 'table') {
      tableNode = node;
      tablePos = $from.before(depth);
      break;
    }
  }

  if (!tableNode) {
    return null;
  }

  // 计算行数和列数
  let rowCount = 0;
  let colCount = 0;

  tableNode.forEach((row) => {
    if (row.type.name === 'tableRow') {
      rowCount++;
      if (colCount === 0) {
        row.forEach((cell) => {
          if (cell.type.name === 'tableCell' || cell.type.name === 'tableHeader') {
            colCount++;
          }
        });
      }
    }
  });

  return {
    node: tableNode,
    pos: tablePos,
    rowCount,
    colCount,
  };
}; 
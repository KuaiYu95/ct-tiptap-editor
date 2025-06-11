import { Extension } from "@tiptap/core";
import { NodeRange as PMNodeRange } from "@tiptap/pm/model";
import {
  Plugin as PMPlugin,
  PluginKey as PMPluginKey,
  Selection as PMSelection,
  SelectionRange as PMSelectionRange,
} from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

type ResolvedPos = any

// Helper function to create decorations for selected node ranges
function getNodeRangeDecorations(ranges: PMSelectionRange[]): DecorationSet {
  if (!ranges.length) return DecorationSet.empty;

  const decorations: Decoration[] = [];
  const doc = ranges[0].$from.node(0);

  ranges.forEach((range) => {
    const pos = range.$from.pos;
    const nodeAfter = range.$from.nodeAfter;

    if (nodeAfter) {
      decorations.push(
        Decoration.node(pos, pos + nodeAfter.nodeSize, {
          class: "ProseMirror-selectednoderange",
        })
      );
    }
  });

  return DecorationSet.create(doc, decorations);
}

// Helper function to get selection ranges
function getSelectionRanges(
  $from: ResolvedPos,
  $to: ResolvedPos,
  depth?: number
): PMSelectionRange[] {
  const ranges: PMSelectionRange[] = [];
  const doc = $from.node(0);

  depth =
    typeof depth === "number" && depth >= 0
      ? depth
      : $from.sameParent($to)
        ? Math.max(0, $from.sharedDepth($to.pos) - 1)
        : $from.sharedDepth($to.pos);

  const nodeRange = new PMNodeRange($from, $to, depth || 0);
  const startPos = nodeRange.depth === 0 ? 0 : doc.resolve(nodeRange.start).posAtIndex(0);

  nodeRange.parent.forEach((node, offset) => {
    const from = startPos + offset;
    const to = from + node.nodeSize;

    if (from < nodeRange.start || from >= nodeRange.end) return;

    const range = new PMSelectionRange(doc.resolve(from), doc.resolve(to));
    ranges.push(range);
  });

  return ranges;
}

// Bookmark class for saving/restoring NodeRangeSelection
class NodeRangeBookmark {
  constructor(public anchor: number, public head: number) { }

  map(mapping: any): NodeRangeBookmark {
    return new NodeRangeBookmark(
      mapping.map(this.anchor),
      mapping.map(this.head)
    );
  }

  resolve(doc: any): NodeRangeSelection {
    const $anchor = doc.resolve(this.anchor);
    const $head = doc.resolve(this.head);
    return new NodeRangeSelection($anchor, $head);
  }
}

// Custom selection class for node ranges
class NodeRangeSelection extends PMSelection {
  public readonly depth: number | undefined;
  public visible = false;

  constructor(
    $anchor: ResolvedPos,
    $head: ResolvedPos,
    depth?: number,
    direction: number = 1
  ) {
    const { doc } = $anchor;
    const isCollapsed = $anchor === $head;
    const isEmptyDoc = $anchor.pos === doc.content.size && $head.pos === doc.content.size;

    const adjustedHead = isCollapsed && !isEmptyDoc
      ? doc.resolve($head.pos + (direction > 0 ? 1 : -1))
      : $head;

    const adjustedAnchor = isCollapsed && isEmptyDoc
      ? doc.resolve($anchor.pos - (direction > 0 ? 1 : -1))
      : $anchor;

    const ranges = getSelectionRanges(
      adjustedAnchor.min(adjustedHead),
      adjustedAnchor.max(adjustedHead),
      depth
    );

    const $from = adjustedHead.pos >= $anchor.pos ? ranges[0].$from : ranges[ranges.length - 1].$to;
    const $to = adjustedHead.pos >= $anchor.pos ? ranges[ranges.length - 1].$to : ranges[0].$from;

    super($from, $to, ranges);
    this.depth = depth;
  }

  get $to(): ResolvedPos {
    return this.ranges[this.ranges.length - 1].$to;
  }

  eq(other: PMSelection): boolean {
    return other instanceof NodeRangeSelection &&
      other.$from.pos === this.$from.pos &&
      other.$to.pos === this.$to.pos;
  }

  map(doc: any, mapping: any): NodeRangeSelection {
    const $anchor = doc.resolve(mapping.map(this.anchor));
    const $head = doc.resolve(mapping.map(this.head));
    return new NodeRangeSelection($anchor, $head);
  }

  toJSON(): { type: string; anchor: number; head: number } {
    return {
      type: "nodeRange",
      anchor: this.anchor,
      head: this.head,
    };
  }

  get isForwards(): boolean {
    return this.head >= this.anchor;
  }

  get isBackwards(): boolean {
    return !this.isForwards;
  }

  extendBackwards(): NodeRangeSelection {
    const { doc } = this.$from;

    if (this.isForwards && this.ranges.length > 1) {
      const newRanges = this.ranges.slice(0, -1);
      const $from = newRanges[0].$from;
      const $to = newRanges[newRanges.length - 1].$to;
      return new NodeRangeSelection($from, $to, this.depth);
    }

    const firstRange = this.ranges[0];
    const newHead = doc.resolve(Math.max(0, firstRange.$from.pos - 1));
    return new NodeRangeSelection(this.$anchor, newHead, this.depth);
  }

  extendForwards(): NodeRangeSelection {
    const { doc } = this.$from;

    if (this.isBackwards && this.ranges.length > 1) {
      const newRanges = this.ranges.slice(1);
      const $from = newRanges[0].$from;
      const $to = newRanges[newRanges.length - 1].$to;
      return new NodeRangeSelection($to, $from, this.depth);
    }

    const lastRange = this.ranges[this.ranges.length - 1];
    const newHead = doc.resolve(Math.min(doc.content.size, lastRange.$to.pos + 1));
    return new NodeRangeSelection(this.$anchor, newHead, this.depth);
  }

  static fromJSON(doc: any, json: { anchor: number; head: number }): NodeRangeSelection {
    return new NodeRangeSelection(
      doc.resolve(json.anchor),
      doc.resolve(json.head)
    );
  }

  static create(
    doc: any,
    anchor: number,
    head: number,
    depth?: number,
    direction: number = 1
  ): NodeRangeSelection {
    return new this(doc.resolve(anchor), doc.resolve(head), depth, direction);
  }

  getBookmark(): NodeRangeBookmark {
    return new NodeRangeBookmark(this.anchor, this.head);
  }
}

// Type guard for NodeRangeSelection
function isNodeRangeSelection(selection: PMSelection): selection is NodeRangeSelection {
  return selection instanceof NodeRangeSelection;
}

// Tiptap extension for node range selection
const NodeRangeExtension = Extension.create({
  name: "nodeRange",

  addOptions() {
    return {
      depth: undefined,
      key: "Mod",
    };
  },

  addKeyboardShortcuts() {
    return {
      "Shift-ArrowUp": ({ editor }) => {
        const { depth } = this.options;
        const { view, state } = editor;
        const { doc, selection, tr } = state;
        const { anchor, head } = selection;

        if (!isNodeRangeSelection(selection)) {
          const newSelection = NodeRangeSelection.create(doc, anchor, head, depth, -1);
          tr.setSelection(newSelection);
          view.dispatch(tr);
          return true;
        }

        const extendedSelection = selection.extendBackwards();
        tr.setSelection(extendedSelection);
        view.dispatch(tr);
        return true;
      },

      "Shift-ArrowDown": ({ editor }) => {
        const { depth } = this.options;
        const { view, state } = editor;
        const { doc, selection, tr } = state;
        const { anchor, head } = selection;

        if (!isNodeRangeSelection(selection)) {
          const newSelection = NodeRangeSelection.create(doc, anchor, head, depth);
          tr.setSelection(newSelection);
          view.dispatch(tr);
          return true;
        }

        const extendedSelection = selection.extendForwards();
        tr.setSelection(extendedSelection);
        view.dispatch(tr);
        return true;
      },

      "Mod-a": ({ editor }) => {
        const { depth } = this.options;
        const { view, state } = editor;
        const { doc, tr } = state;
        const selection = NodeRangeSelection.create(doc, 0, doc.content.size, depth);
        tr.setSelection(selection);
        view.dispatch(tr);
        return true;
      },
    };
  },

  onSelectionUpdate() {
    const { selection } = this.editor.state;
    if (isNodeRangeSelection(selection)) {
      this.editor.view.dom.classList.add("ProseMirror-noderangeselection");
    }
  },

  addProseMirrorPlugins() {
    let hasNodeRangeSelection = false;
    let isMouseDownWithModifier = false;

    return [
      new PMPlugin({
        key: new PMPluginKey("nodeRange"),
        props: {
          attributes: () => ({
            class: hasNodeRangeSelection ? "ProseMirror-noderangeselection" : "",
          }),

          handleDOMEvents: {
            mousedown: (view, event) => {
              const { key } = this.options;
              const isMac = /Mac/.test(navigator.platform);
              const hasShift = !!event.shiftKey;
              const hasCtrl = !!event.ctrlKey;
              const hasAlt = !!event.altKey;
              const hasMeta = !!event.metaKey;

              const modifierPressed =
                key === undefined ||
                (key === "Shift" && hasShift) ||
                (key === "Control" && hasCtrl) ||
                (key === "Alt" && hasAlt) ||
                (key === "Meta" && hasMeta) ||
                (key === "Mod" && (isMac ? hasMeta : hasCtrl));

              if (modifierPressed) {
                isMouseDownWithModifier = true;

                document.addEventListener(
                  "mouseup",
                  () => {
                    isMouseDownWithModifier = false;
                    const { state } = view;
                    const { doc, selection, tr } = state;
                    const { $anchor, $head } = selection;

                    if ($anchor.sameParent($head)) return;

                    const newSelection = NodeRangeSelection.create(
                      doc,
                      $anchor.pos,
                      $head.pos,
                      this.options.depth
                    );
                    tr.setSelection(newSelection);
                    view.dispatch(tr);
                  },
                  { once: true }
                );
              }

              return false;
            },
          },

          decorations: (state) => {
            const { selection } = state;
            const isNodeRange = isNodeRangeSelection(selection);

            hasNodeRangeSelection = false;

            if (!isMouseDownWithModifier) {
              return isNodeRange ? getNodeRangeDecorations(selection.ranges as PMSelectionRange[]) : null;
            }

            const { $from, $to } = selection;
            if (!isNodeRange && $from.sameParent($to)) return null;

            const ranges = getSelectionRanges($from, $to, this.options.depth);
            if (ranges.length) {
              hasNodeRangeSelection = true;
              return getNodeRangeDecorations(ranges);
            }

            return null;
          },
        },
      }),
    ];
  },
});

export {
  NodeRangeExtension as default,
  getNodeRangeDecorations,
  getSelectionRanges,
  isNodeRangeSelection,
  NodeRangeExtension as NodeRange,
  NodeRangeSelection
};


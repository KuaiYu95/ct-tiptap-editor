import { PluginKey } from "@tiptap/pm/state";
import React, { useEffect, useRef, useState } from "react";
import { DragHandlePlugin, dragHandlePluginDefaultKey } from "../../utils/drag-handler";

interface DragHandleProps {
  className?: string;
  children?: React.ReactNode;
  editor: any;
  pluginKey?: PluginKey;
  onNodeChange?: (params: { editor: any; node: any; pos: number }) => void;
  tippyOptions?: Record<string, any>;
}

const DragHandle: React.FC<DragHandleProps> = ({
  className = "drag-handle",
  children,
  editor,
  pluginKey = dragHandlePluginDefaultKey,
  onNodeChange,
  tippyOptions = {}
}) => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const pluginRef = useRef<any>(null);

  useEffect(() => {
    if (!element) return;

    if (editor.isDestroyed) {
      pluginRef.current = null;
      return;
    }

    if (!pluginRef.current) {
      pluginRef.current = DragHandlePlugin({
        editor,
        element,
        pluginKey,
        tippyOptions,
        onNodeChange
      });
      editor.registerPlugin(pluginRef.current);
    }

    return () => {
      editor.unregisterPlugin(pluginKey);
      pluginRef.current = null;
    };
  }, [element, editor, onNodeChange, pluginKey]);

  return (
    <div className={className} ref={setElement} >
      {children}
    </div>
  );
};

export { DragHandle as default, DragHandle };


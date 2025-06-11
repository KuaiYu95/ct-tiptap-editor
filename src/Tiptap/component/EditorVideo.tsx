import { type Editor } from "@tiptap/react"
import * as React from "react"
import { VideoIcon } from "../icons/video-icon"
import EditorToolbarButton from "./EditorToolbarButton"

export interface VideoUploadButtonProps {
  editor: Editor | null
  extensionName?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function isVideoActive(
  editor: Editor | null,
  extensionName: string
): boolean {
  if (!editor) return false
  return editor.isActive(extensionName)
}

export function insertVideo(
  editor: Editor | null,
  extensionName: string
): boolean {
  if (!editor) return false

  return editor
    .chain()
    .focus()
    .insertContent({
      type: extensionName,
    })
    .run()
}

export function useVideoUploadButton(
  editor: Editor | null,
  extensionName: string = "videoUpload",
) {
  const isActive = isVideoActive(editor, extensionName)
  const handleInsertVideo = React.useCallback(() => {
    return insertVideo(editor, extensionName)
  }, [editor, extensionName])

  return {
    isActive,
    handleInsertVideo,
  }
}

const EditorVideo = ({ editor, extensionName, onClick }: VideoUploadButtonProps) => {
  const { isActive, handleInsertVideo } = useVideoUploadButton(
    editor,
    extensionName,
  )

  const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    if (!e.defaultPrevented) {
      handleInsertVideo()
    }
  }, [onClick, handleInsertVideo])

  if (!editor || !editor.isEditable) {
    return null
  }

  return (
    <EditorToolbarButton
      tip={'视频'}
      icon={<VideoIcon sx={{ fontSize: 18 }} />}
      onClick={handleClick}
      className={isActive ? "active" : ""}
    />
  )
}

export default EditorVideo
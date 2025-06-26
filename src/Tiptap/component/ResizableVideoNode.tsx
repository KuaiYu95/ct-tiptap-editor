import { Box } from "@mui/material"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import * as React from "react"

// 拖拽图标组件
const ResizeIcon: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 0L0 12V8L8 0H12ZM12 4L4 12H8L12 8V4Z"
      fill="currentColor"
    />
  </svg>
)

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
  isVisible: boolean
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, isVisible }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 20,
      height: 20,
      bgcolor: 'primary.main',
      border: '2px solid white',
      borderRadius: '6px',
      cursor: 'nw-resize',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? 'visible' : 'hidden',
      transition: 'opacity 0.2s ease, transform 0.1s ease, visibility 0.2s ease',
      userSelect: 'none',
      zIndex: 10,
      '&:hover': {
        backgroundColor: 'primary.main',
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
    onMouseDown={onMouseDown}
  >
    <ResizeIcon />
  </Box>
)

export const ResizableVideoNode: React.FC<NodeViewProps> = (props) => {
  const { src, title, width, height } = props.node.attrs
  const [isHovered, setIsHovered] = React.useState(false)
  const [isResizing, setIsResizing] = React.useState(false)
  const isEditable = props.editor.isEditable
  const [dimensions, setDimensions] = React.useState({
    width: width || null,
    height: height || null
  })
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 计算初始尺寸
  React.useEffect(() => {
    if (videoRef.current && !width && !height) {
      const video = videoRef.current
      const handleLoadedMetadata = () => {
        const containerWidth = containerRef.current?.clientWidth || 800
        const videoWidth = video.videoWidth
        const videoHeight = video.videoHeight
        const aspectRatio = videoHeight / videoWidth

        // 设置默认宽度为容器100%宽度，高度按比例计算
        const defaultWidth = containerWidth
        const defaultHeight = Math.round(defaultWidth * aspectRatio)

        setDimensions({
          width: defaultWidth,
          height: defaultHeight
        })

        // 更新节点属性
        props.updateAttributes({
          width: defaultWidth,
          height: defaultHeight
        })
      }

      if (video.readyState >= 1) {
        handleLoadedMetadata()
      } else {
        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [src, width, height, props])

  // 处理拖拽调整大小
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)

    const startX = e.clientX
    const startY = e.clientY
    const startWidth = dimensions.width || 0
    const startHeight = dimensions.height || 0
    const aspectRatio = startHeight / startWidth

    // 添加全局样式防止选择文本
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'nw-resize'

    // 使用ref来存储最新的尺寸值，避免闭包问题
    let currentDimensions = { width: startWidth, height: startHeight }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY

      // 优先使用X轴移动来计算新尺寸，保持宽高比
      let newWidth = Math.max(100, startWidth + deltaX)
      let newHeight = Math.round(newWidth * aspectRatio)

      // 如果Y轴移动更大，则使用Y轴来计算
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        newHeight = Math.max(60, startHeight + deltaY)
        newWidth = Math.round(newHeight / aspectRatio)
      }

      // 限制最大尺寸
      const maxWidth = containerRef.current?.clientWidth || 1200
      if (newWidth > maxWidth) {
        newWidth = maxWidth
        newHeight = Math.round(newWidth * aspectRatio)
      }

      // 更新当前尺寸变量
      currentDimensions = { width: newWidth, height: newHeight }

      setDimensions({
        width: newWidth,
        height: newHeight
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)

      // 恢复全局样式
      document.body.style.userSelect = ''
      document.body.style.cursor = ''

      // 使用最新的尺寸值更新节点属性
      props.updateAttributes({
        width: currentDimensions.width,
        height: currentDimensions.height
      })

      // 确保状态和属性同步
      setDimensions({
        width: currentDimensions.width,
        height: currentDimensions.height
      })

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [dimensions, props])

  return (
    <NodeViewWrapper>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          display: 'inline-block',
        }}
        onMouseEnter={() => isEditable && setIsHovered(true)}
        onMouseLeave={() => isEditable && !isResizing && setIsHovered(false)}
      >
        <video
          ref={videoRef}
          src={src}
          title={title || ''}
          controls
          loop={false}
          muted={false}
          playsInline
          style={{
            width: dimensions.width ? `${dimensions.width}px` : '100%',
            height: dimensions.height ? `${dimensions.height}px` : 'auto',
            display: 'block',
            borderRadius: '8px',
            boxShadow: isHovered || isResizing ? '0 4px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
            transition: isResizing ? 'none' : 'all 0.2s ease',
            border: isHovered || isResizing ? '2px solid rgba(25, 118, 210, 0.3)' : '2px solid transparent',
          }}
        />

        {isEditable && (
          <ResizeHandle
            onMouseDown={handleMouseDown}
            isVisible={isHovered || isResizing}
          />
        )}
      </Box>
    </NodeViewWrapper>
  )
} 
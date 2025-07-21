import { Box, IconButton, Stack } from "@mui/material"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import * as React from "react"
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import type { UploadFunction } from "../extension/ImageUploadExtension"
import { CancelIcon } from "../icons/cancel-icon"
import { CropIcon } from "../icons/corp-icon"
import { OkIcon } from "../icons/ok-icon"
import { ResizeIcon } from "../icons/resize-icon"

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void
  isVisible: boolean
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, isVisible }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 2.5,
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
    }}
    onMouseDown={onMouseDown}
  >
    <ResizeIcon sx={{ fontSize: 16 }} />
  </Box>
)

interface CropButtonProps {
  onClick: () => void
  isVisible: boolean
}

const CropButton: React.FC<CropButtonProps> = ({ onClick, isVisible }) => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: 20,
      height: 20,
      bgcolor: 'rgba(0, 0, 0, 0.2)',
      border: '2px solid white',
      borderRadius: '6px',
      cursor: 'pointer',
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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
    onClick={onClick}
  >
    <CropIcon sx={{ fontSize: 18 }} />
  </Box>
)

export const ResizableImageNode: React.FC<NodeViewProps> = (props) => {
  const { src, title, width, height } = props.node.attrs
  const [isHovered, setIsHovered] = React.useState(false)
  const [isResizing, setIsResizing] = React.useState(false)
  const [isCropping, setIsCropping] = React.useState(false)
  const isEditable = props.editor.isEditable
  const [dimensions, setDimensions] = React.useState({
    width: width || null,
    height: height || null
  })
  const [crop, setCrop] = React.useState<Crop>({
    unit: 'px',
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })
  const imageRef = React.useRef<HTMLImageElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const isInitialized = React.useRef(false)

  // 使用 useCallback 包装 updateAttributes 以保持引用稳定
  const updateAttributes = React.useCallback((attrs: any) => {
    props.updateAttributes(attrs)
  }, [props.updateAttributes])

  // 计算初始尺寸
  React.useEffect(() => {
    // 添加条件检查，防止重复初始化
    if (imageRef.current && !width && !height && !isInitialized.current) {
      const image = imageRef.current
      const handleLoad = () => {
        // 防止重复执行
        if (isInitialized.current) return

        const containerWidth = containerRef.current?.clientWidth || 800
        const imageWidth = image.naturalWidth
        const imageHeight = image.naturalHeight

        // 确保图像有有效尺寸
        if (imageWidth === 0 || imageHeight === 0) return

        const aspectRatio = imageHeight / imageWidth

        // 设置默认宽度为容器100%宽度，高度按比例计算
        const defaultWidth = Math.min(containerWidth, imageWidth)
        const defaultHeight = Math.round(defaultWidth * aspectRatio)

        // 标记为已初始化
        isInitialized.current = true

        setDimensions({
          width: defaultWidth,
          height: defaultHeight
        })

        // 更新节点属性
        updateAttributes({
          width: defaultWidth,
          height: defaultHeight
        })

        // 初始化裁切区域
        setCrop({
          unit: 'px',
          width: defaultWidth,
          height: defaultHeight,
          x: 0,
          y: 0
        })
      }

      if (image.complete) {
        handleLoad()
      } else {
        image.addEventListener('load', handleLoad)
        return () => image.removeEventListener('load', handleLoad)
      }
    }
  }, [src, width, height, updateAttributes])

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

      // 限制最大尺寸 - 使用编辑器容器或合理的最大宽度
      const editorContainer = containerRef.current?.closest('.editor-container, .ProseMirror')
      const maxWidth = (editorContainer as HTMLElement)?.clientWidth || 1200
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
      updateAttributes({
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
  }, [dimensions, updateAttributes])

  // 处理裁切
  const handleCropClick = () => {
    setIsCropping(true)
    if (imageRef.current) {
      const { width: imgWidth, height: imgHeight } = imageRef.current.getBoundingClientRect()
      setCrop({
        unit: 'px',
        width: imgWidth - 12,
        height: imgHeight - 12,
        x: 0,
        y: 0
      })
    }
  }

  const handleCropComplete = async () => {
    if (!imageRef.current || !crop.width || !crop.height) return

    const canvas = document.createElement('canvas')
    const image = imageRef.current
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    if (ctx) {
      try {
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY
        )

        // 检查是否有上传函数配置
        const imageUploadExtension = props.editor.extensionManager.extensions.find(
          ext => ext.name === 'imageUpload'
        )
        const uploadFunction: UploadFunction | undefined = imageUploadExtension?.options?.upload

        let newSrc: string

        if (uploadFunction) {
          // 如果有上传函数，将canvas转换为blob并上传
          try {
            const blob = await new Promise<Blob>((resolve, reject) => {
              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob)
                } else {
                  reject(new Error('Failed to create blob from canvas'))
                }
              }, 'image/png', 0.9)
            })

            // 创建临时文件对象
            const file = new File([blob], 'cropped-image.png', { type: 'image/png' })

            // 调用上传函数
            newSrc = await uploadFunction(
              file,
              (event: { progress: number }) => {
                // 可以在这里显示上传进度
                console.log('Upload progress:', event.progress)
              },
              new AbortController().signal
            )

            if (!newSrc) {
              throw new Error('Upload failed: No URL returned')
            }
          } catch (error) {
            console.error('Upload failed, fallback to base64:', error)
            // 上传失败时回退到base64格式
            try {
              newSrc = canvas.toDataURL('image/png')
            } catch (canvasError) {
              console.error('Canvas toDataURL failed (possibly due to CORS):', canvasError)
              // 如果canvas也无法导出，使用原始图片
              newSrc = src
            }
          }
        } else {
          // 没有上传函数时，直接使用base64格式
          try {
            newSrc = canvas.toDataURL('image/png')
          } catch (canvasError) {
            console.error('Canvas toDataURL failed (possibly due to CORS):', canvasError)
            // 如果canvas也无法导出，使用原始图片
            newSrc = src
          }
        }

        // 更新图片源和尺寸
        updateAttributes({
          src: newSrc,
          width: crop.width,
          height: crop.height
        })

        setDimensions({
          width: crop.width,
          height: crop.height
        })

      } catch (error) {
        console.error('Failed to process image crop:', error)
        // 如果整个过程失败，至少更新尺寸
        updateAttributes({
          width: crop.width,
          height: crop.height
        })

        setDimensions({
          width: crop.width,
          height: crop.height
        })
      }
    }

    setIsCropping(false)
  }

  const handleCropCancel = () => {
    setIsCropping(false)
  }

  return (
    <NodeViewWrapper as='span'>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          display: 'inline-block',
          margin: '0 8px',
          verticalAlign: 'middle',
          lineHeight: 1,
        }}
        onMouseEnter={() => isEditable && setIsHovered(true)}
        onMouseLeave={() => isEditable && !isResizing && !isCropping && setIsHovered(false)}
      >
        {isCropping ? (
          <Box sx={{
            position: 'relative',
            p: '5px',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 'var(--mui-shape-borderRadius)',
          }}>
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
            >
              <img
                ref={imageRef}
                src={src}
                alt={title || ''}
                style={{
                  padding: 0,
                  width: dimensions.width ? `${dimensions.width - 12}px` : '100%',
                  maxWidth: '100%',
                  height: dimensions.height ? `${dimensions.height - 12}px` : 'auto',
                }}
              />
            </ReactCrop>
            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 20 }}>
              <Stack direction="row" spacing={1} sx={{ height: 20 }}>
                <IconButton
                  size="small"
                  onClick={handleCropComplete}
                  sx={{
                    width: 20,
                    bgcolor: '#fff',
                    color: 'success.main',
                    '&:hover': {
                      bgcolor: '#fff',
                    }
                  }}
                >
                  <OkIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleCropCancel}
                  sx={{
                    width: 20,
                    bgcolor: '#fff',
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: '#fff',
                    }
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </Stack>
            </Box>
          </Box>
        ) : (
          <>
            <Box
              component={'img'}
              ref={imageRef}
              src={src}
              alt={title || ''}
              style={{
                width: dimensions.width ? `${dimensions.width}px` : 'auto',
                height: dimensions.height ? `${dimensions.height}px` : 'auto',
                borderRadius: 'var(--mui-shape-borderRadius)',
                transition: isResizing ? 'none' : 'all 0.2s ease',
                borderColor: isHovered || isResizing ? 'primary.main' : 'divider',
              }}
            />

            {isEditable && (
              <CropButton
                onClick={handleCropClick}
                isVisible={isHovered || isResizing}
              />
            )}

            {isEditable && (
              <ResizeHandle
                onMouseDown={handleMouseDown}
                isVisible={isHovered || isResizing}
              />
            )}
          </>
        )}
      </Box>
    </NodeViewWrapper>
  )
} 
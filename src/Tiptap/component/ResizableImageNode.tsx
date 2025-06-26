import { Box, IconButton, Stack } from "@mui/material"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper } from "@tiptap/react"
import * as React from "react"
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import type { UploadFunction } from "../extension/ImageUpload"
import { CancelIcon } from "../icons/cancel-icon"
import { OkIcon } from "../icons/ok-icon"

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

// 裁切图标组件
const CropIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 17H17V7H19V17C19 18.1 18.1 19 17 19H7V17ZM17 3H9.5L7.5 5H17C18.1 5 19 5.9 19 7V16.5L17 14.5V7H17ZM1 1L3.9 3.9L5 3V7C5 8.1 5.9 9 7 9H11L13 11V17C13 18.1 12.1 19 11 19H7C5.9 19 5 18.1 5 17V13L1 9L1 1Z"
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
      bgcolor: 'rgba(0, 0, 0, 0.7)',
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
    onClick={onClick}
  >
    <CropIcon />
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

  // 计算初始尺寸
  React.useEffect(() => {
    if (imageRef.current && !width && !height) {
      const image = imageRef.current
      const handleLoad = () => {
        const containerWidth = containerRef.current?.clientWidth || 800
        const imageWidth = image.naturalWidth
        const imageHeight = image.naturalHeight
        const aspectRatio = imageHeight / imageWidth

        // 设置默认宽度为容器100%宽度，高度按比例计算
        const defaultWidth = Math.min(containerWidth, imageWidth)
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
        props.updateAttributes({
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
        props.updateAttributes({
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
    <NodeViewWrapper>
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          display: 'inline-block',
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
            img: {
              p: 0,
              lineHeight: 1,
            }
          }}>
            <ReactCrop
              crop={crop}
              onChange={c => setCrop(c)}
            >
              <img
                ref={imageRef}
                src={src}
                alt={title || ''}
                crossOrigin="anonymous"
                style={{
                  width: dimensions.width ? `${dimensions.width}px` : '100%',
                  maxWidth: '100%',
                  height: dimensions.height ? `${dimensions.height}px` : 'auto',
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
              crossOrigin="anonymous"
              style={{
                width: dimensions.width ? `${dimensions.width}px` : '100%',
                height: dimensions.height ? `${dimensions.height}px` : 'auto',
                display: 'block',
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
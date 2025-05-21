import { Stack } from "@mui/material"
import { Modal } from "ct-mui"
import React, { useEffect, useRef, useState } from "react"
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageEditDialogProps {
  open: boolean
  onClose: () => void
  imageFile: File | null
  onConfirm: (url: string, file?: File) => void
}

const ImageEditDialog = ({ open, onClose, imageFile, onConfirm }: ImageEditDialogProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    width: 0,
    height: 0,
    x: 0,
    y: 0
  })
  const [imageSrc, setImageSrc] = useState<string>('')
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(imageFile)
    }
  }, [imageFile])

  const onImageLoad = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current
      setCrop({
        unit: 'px',
        width,
        height,
        x: 0,
        y: 0
      })
    }
  }

  const handleCropComplete = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return

    const canvas = document.createElement('canvas')
    const image = imgRef.current
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    const ctx = canvas.getContext('2d')

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    if (ctx) {
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

      const dataUrl = canvas.toDataURL('image/png')
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], imageFile?.name || 'cropped-image.png', { type: 'image/png' })
          onConfirm(dataUrl, file)
        } else {
          onConfirm(dataUrl)
        }
      })
      onClose()
    }
  }

  if (!imageFile) return null
  return <Modal
    open={open}
    onCancel={() => {
      setImageSrc('')
      setCrop({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
      })
      onClose()
    }}
    width={800}
    title="编辑图片"
    onOk={handleCropComplete}
  >
    <Stack spacing={2}>
      <Stack alignItems="center" justifyContent="center" style={{
        width: '704px',
        height: '500px',
      }}>
        {imageSrc && (
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="裁切图片"
              style={{
                maxWidth: '704px',
                maxHeight: '500px',
                objectFit: 'contain'
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        )}
      </Stack>
    </Stack>
  </Modal>
}

export default ImageEditDialog
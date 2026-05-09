import {
  DEFAULT_JPEG_QUALITY,
  DEFAULT_MAX_SIZE_KB,
  JPEG_MIME_TYPE,
  JPEG_QUALITY_STEP,
  MAX_IMAGE_DIMENSION_PX,
  MIN_JPEG_QUALITY,
} from "@/constants/image"

type CompressImageOptions = {
  maxSizeKB?: number
  maxDimensionPx?: number
}

function toBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob() returned null."))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality,
    )
  })
}

function calculateScaledSize(
  width: number,
  height: number,
  maxDimensionPx: number,
) {
  const scale = Math.min(1, maxDimensionPx / Math.max(width, height))
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
    scale,
  }
}

export function useImageCompressor() {
  async function compressImage(
    file: File,
    options: CompressImageOptions = {},
  ): Promise<Blob> {
    const maxSizeKB = options.maxSizeKB ?? DEFAULT_MAX_SIZE_KB
    const maxDimensionPx = options.maxDimensionPx ?? MAX_IMAGE_DIMENSION_PX

    const imageBitmap = await createImageBitmap(file)
    const { width, height } = calculateScaledSize(
      imageBitmap.width,
      imageBitmap.height,
      maxDimensionPx,
    )

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      throw new Error("2D canvas context is not available.")
    }

    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

    let quality = DEFAULT_JPEG_QUALITY
    let blob = await toBlob(canvas, JPEG_MIME_TYPE, quality)

    const maxBytes = maxSizeKB * 1024
    while (blob.size > maxBytes && quality > MIN_JPEG_QUALITY) {
      quality = Math.max(MIN_JPEG_QUALITY, quality - JPEG_QUALITY_STEP)
      blob = await toBlob(canvas, JPEG_MIME_TYPE, quality)
    }

    return blob
  }

  return { compressImage }
}


/** Same max height for upload preview and live camera preview so WYSIWYG with capture. */
export const IMAGE_PREVIEW_MAX_HEIGHT_VH = 60 as const

export const IMAGE_PREVIEW_MAX_HEIGHT_STYLE = {
  maxHeight: `${IMAGE_PREVIEW_MAX_HEIGHT_VH}vh`,
} as const

export const MAX_UPLOAD_SIZE_BYTES = 1 * 1024 * 1024
export const DEFAULT_MAX_SIZE_KB = 1024
export const MAX_IMAGE_DIMENSION_PX = 1920

export const DEFAULT_JPEG_QUALITY = 0.9
export const MIN_JPEG_QUALITY = 0.1
export const JPEG_QUALITY_STEP = 0.1

export const JPEG_MIME_TYPE = "image/jpeg" as const

/** Shown in the image panel empty state (PRD). */
export const HANDWRITING_WARNING_LINES = [
  "손글씨 수식은 인식이 부정확할 수 있습니다.",
  "가능하면 인쇄물의 이미지를 사용해 주세요.",
] as const

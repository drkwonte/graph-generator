import * as React from "react"

import { PanelBody } from "@/components/PanelBody"
import { PanelCard } from "@/components/PanelCard"
import { Button } from "@/components/ui/button"
import { HANDWRITING_WARNING_LINES, MAX_UPLOAD_SIZE_BYTES } from "@/constants/image"
import { useImageCompressor } from "@/hooks/useImageCompressor"

const ACCEPTED_IMAGE_TYPES = "image/*" as const
const PANEL_TITLE = "이미지 업로드" as const
const CHOOSE_FILE_BUTTON_TEXT = "파일 선택" as const
const OPEN_CAMERA_BUTTON_TEXT = "사진 촬영" as const
const CAPTURE_BUTTON_TEXT = "촬영" as const
const CLOSE_CAMERA_BUTTON_TEXT = "닫기" as const
const PREVIEW_PLACEHOLDER_TEXT =
  "이미지를 업로드하면 이곳에 미리보기가 표시됩니다." as const
const PASTE_HELP_TEXT = "또는 이 영역을 클릭한 뒤 Ctrl+V로 클립보드 이미지를 붙여넣을 수 있어요." as const
const CLIPBOARD_FILENAME = "clipboard-image.png" as const
const CAMERA_FILENAME = "camera-capture.png" as const
const CAMERA_VIDEO_NOT_READY_MESSAGE =
  "카메라 영상이 아직 준비되지 않았습니다. 잠시 기다린 뒤 촬영을 눌러주세요." as const

async function requestCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("이 브라우저에서는 카메라 촬영을 지원하지 않습니다.")
  }
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    })
  } catch {
    return await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  }
}

export type ImageUploaderResult = {
  originalFile: File
  compressedBlob: Blob
  previewUrl: string
}

export type ImageUploaderProps = {
  onReady: (result: ImageUploaderResult) => void
}

export function ImageUploader({ onReady }: ImageUploaderProps) {
  const { compressImage } = useImageCompressor()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const dropZoneRef = React.useRef<HTMLDivElement | null>(null)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)

  const [isWorking, setIsWorking] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = React.useState(false)
  const [cameraStream, setCameraStream] = React.useState<MediaStream | null>(null)
  const [isCameraVideoReady, setIsCameraVideoReady] = React.useState(false)

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  React.useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop())
    }
  }, [cameraStream])

  React.useLayoutEffect(() => {
    if (!isCameraOpen || !cameraStream) return

    const video = videoRef.current
    if (!video) return

    setIsCameraVideoReady(false)
    video.srcObject = cameraStream
    video.muted = true

    const onLoadedMetadata = () => {
      setIsCameraVideoReady(true)
    }
    video.addEventListener("loadedmetadata", onLoadedMetadata)

    void video.play().catch(() => {
      setErrorMessage("카메라 미리보기를 재생할 수 없습니다. 브라우저 설정을 확인해주세요.")
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.srcObject = null
      cameraStream.getTracks().forEach((t) => t.stop())
      setCameraStream(null)
      setIsCameraOpen(false)
    })

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata)
      video.srcObject = null
      setIsCameraVideoReady(false)
    }
  }, [isCameraOpen, cameraStream])

  async function handleClipboardImage(blob: Blob) {
    const file = new File([blob], CLIPBOARD_FILENAME, {
      type: blob.type || "image/png",
      lastModified: Date.now(),
    })
    await handleFile(file)
  }

  async function handleFile(file: File) {
    setIsWorking(true)
    setErrorMessage(null)

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("이미지 파일만 업로드할 수 있습니다.")
      }

      const compressedBlob =
        file.size > MAX_UPLOAD_SIZE_BYTES ? await compressImage(file) : file

      const nextPreviewUrl = URL.createObjectURL(compressedBlob)

      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(nextPreviewUrl)

      onReady({
        originalFile: file,
        compressedBlob,
        previewUrl: nextPreviewUrl,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "업로드에 실패했습니다."
      setErrorMessage(message)
    } finally {
      setIsWorking(false)
    }
  }

  function handleChooseClick() {
    fileInputRef.current?.click()
  }

  function focusDropZone() {
    dropZoneRef.current?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    if (isWorking) return
    const items = e.clipboardData?.items
    if (!items?.length) return

    const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"))
    if (!imageItem) return

    const blob = imageItem.getAsFile()
    if (!blob) return

    e.preventDefault()
    void handleClipboardImage(blob)
  }

  async function openCamera() {
    if (isWorking) return
    setErrorMessage(null)
    setIsCameraVideoReady(false)

    let stream: MediaStream | null = null
    try {
      stream = await requestCameraStream()
      setCameraStream(stream)
      setIsCameraOpen(true)
    } catch (error) {
      stream?.getTracks().forEach((t) => t.stop())
      const message =
        error instanceof Error ? error.message : "카메라를 여는 데 실패했습니다."
      setErrorMessage(message)
      setIsCameraOpen(false)
      setCameraStream(null)
    }
  }

  function closeCamera() {
    cameraStream?.getTracks().forEach((t) => t.stop())
    setCameraStream(null)
    setIsCameraOpen(false)
    setIsCameraVideoReady(false)
  }

  async function captureFromCamera() {
    if (isWorking) return
    const video = videoRef.current
    if (!video) return
    if (!cameraStream) return

    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) {
      setErrorMessage(CAMERA_VIDEO_NOT_READY_MESSAGE)
      return
    }

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setErrorMessage("캔버스를 초기화할 수 없습니다.")
      return
    }

    ctx.drawImage(video, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), "image/png")
    })
    if (!blob) {
      setErrorMessage("촬영 이미지를 생성할 수 없습니다.")
      return
    }

    const file = new File([blob], CAMERA_FILENAME, {
      type: "image/png",
      lastModified: Date.now(),
    })

    await handleFile(file)
    closeCamera()
    focusDropZone()
  }

  return (
    <section className="space-y-3">
      <PanelCard
        title={PANEL_TITLE}
        action={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_IMAGE_TYPES}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
              }}
            />
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleChooseClick}>
                {CHOOSE_FILE_BUTTON_TEXT}
              </Button>
              <Button type="button" variant="outline" onClick={() => void openCamera()}>
                {OPEN_CAMERA_BUTTON_TEXT}
              </Button>
            </div>
          </>
        }
      >
        <PanelBody
          main={
            <div
              ref={dropZoneRef}
              tabIndex={0}
              onPaste={handlePaste}
              className="h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="이미지 업로드 영역 (클립보드 붙여넣기 가능)"
              onClick={focusDropZone}
            >
              {isCameraOpen ? (
                <div className="flex h-full flex-col gap-3 bg-muted/5 p-3">
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                      playsInline
                      muted
                    />
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button type="button" variant="outline" onClick={closeCamera}>
                      {CLOSE_CAMERA_BUTTON_TEXT}
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => void captureFromCamera()}
                      disabled={isWorking || !isCameraVideoReady}
                    >
                      {CAPTURE_BUTTON_TEXT}
                    </Button>
                  </div>
                </div>
              ) : previewUrl ? (
                <div className="flex h-full items-center justify-center bg-muted/5 p-3">
                  <img
                    src={previewUrl}
                    alt="업로드된 이미지 미리보기"
                    className="max-h-[60vh] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 bg-background p-6 text-sm text-muted-foreground">
                  <div className="text-center">{PREVIEW_PLACEHOLDER_TEXT}</div>
                  <div className="text-center text-xs text-muted-foreground/90">
                    {PASTE_HELP_TEXT}
                  </div>
                  <div className="max-w-md space-y-1 text-center text-xs leading-relaxed text-muted-foreground/90">
                    {HANDWRITING_WARNING_LINES.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
        />
      </PanelCard>

      {isWorking ? (
        <div className="text-sm text-muted-foreground">이미지를 처리 중…</div>
      ) : null}
      {errorMessage ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}
    </section>
  )
}


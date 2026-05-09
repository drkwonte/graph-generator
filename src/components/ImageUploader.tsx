import * as React from "react"

import { PanelBody } from "@/components/PanelBody"
import { PanelCard } from "@/components/PanelCard"
import { Button } from "@/components/ui/button"
import { HANDWRITING_WARNING_LINES, MAX_UPLOAD_SIZE_BYTES } from "@/constants/image"
import { useImageCompressor } from "@/hooks/useImageCompressor"

const ACCEPTED_IMAGE_TYPES = "image/*" as const
const PANEL_TITLE = "이미지 업로드" as const
const PREVIEW_PLACEHOLDER_TEXT =
  "이미지를 업로드하면 이곳에 미리보기가 표시됩니다." as const

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

  const [isWorking, setIsWorking] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

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
            <Button type="button" variant="outline" onClick={handleChooseClick}>
              파일 선택
            </Button>
          </>
        }
      >
        <PanelBody
          main={
            previewUrl ? (
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
                <div className="max-w-md space-y-1 text-center text-xs leading-relaxed text-muted-foreground/90">
                  {HANDWRITING_WARNING_LINES.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            )
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


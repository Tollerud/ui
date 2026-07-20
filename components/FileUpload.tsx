'use client'

import { type DragEvent, forwardRef, useId, useRef, useState } from 'react'
import { Upload, X, File as FileIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  label?: string
  description?: React.ReactNode
  error?: string
  /** Primary CTA in the drop zone. Default: `Click to upload` */
  clickLabel?: React.ReactNode
  /** Secondary drag hint after the CTA. Default: `or drag and drop`. Pass `null` or `''` to hide. */
  dragLabel?: React.ReactNode
  /** Forwarded to the underlying `<input accept>` */
  accept?: string
  multiple?: boolean
  /** Called whenever the selected file list changes */
  onFilesChange?: (files: File[]) => void
  className?: string
  disabled?: boolean
  required?: boolean
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  {
    label,
    description,
    error,
    clickLabel = 'Click to upload',
    dragLabel = 'or drag and drop',
    accept,
    multiple,
    onFilesChange,
    className,
    disabled,
    required,
  },
  ref
) {
  const id = useId()
  const autoErrorId = useId()
  const errorId = error ? autoErrorId : undefined
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)

  const setAndNotify = (next: File[]) => {
    setFiles(next)
    onFilesChange?.(next)
  }

  const addFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return
    const incomingArr = Array.from(incoming)
    setAndNotify(multiple ? [...files, ...incomingArr] : [incomingArr[0]!])
  }

  const removeAt = (index: number) => {
    setAndNotify(files.filter((_, i) => i !== index))
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    addFiles(e.dataTransfer.files)
  }

  return (
    <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-tollerud-text-muted">
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-tollerud-error">*</span>}
        </label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={errorId}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded border border-dashed px-6 py-8 text-center cursor-pointer transition-colors duration-fast',
          dragging
            ? 'border-tollerud-yellow bg-tollerud-yellow/[0.06]'
            : 'border-tollerud-border bg-tollerud-surface-raised hover:border-tollerud-text-secondary',
          error && 'border-tollerud-error',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <Upload size={20} className="text-tollerud-text-muted" />
        <div className="text-sm text-tollerud-text-secondary">
          <span className="font-medium text-tollerud-yellow">{clickLabel}</span>
          {dragLabel != null && dragLabel !== '' ? (
            <>
              {' '}
              {dragLabel}
            </>
          ) : null}
        </div>
        {description && <p className="text-xs text-tollerud-text-muted">{description}</p>}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          onChange={(e) => addFiles(e.target.files)}
          className="sr-only"
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-2.5 rounded border border-tollerud-border bg-tollerud-surface-raised px-3 py-2 text-sm"
            >
              <FileIcon size={15} className="shrink-0 text-tollerud-text-muted" />
              <span className="flex-1 truncate text-tollerud-text-primary">{file.name}</span>
              <span className="shrink-0 text-xs text-tollerud-text-muted">{formatBytes(file.size)}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => removeAt(i)}
                className="shrink-0 text-tollerud-text-muted hover:text-tollerud-text-primary transition-colors duration-fast"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p id={errorId} className="text-xs text-tollerud-error">{error}</p>}
    </div>
  )
})
FileUpload.displayName = 'FileUpload'

export { FileUpload }

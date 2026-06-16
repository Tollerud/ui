'use client'

import { CircleCheck, CircleX, Info, X, Zap, type LucideIcon } from 'lucide-react'
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

export type ToastTone = 'success' | 'error' | 'info' | 'accent'

export interface ToastInput {
  tone?: ToastTone
  title: string
  message?: string
  duration?: number
}

interface ToastRecord extends ToastInput {
  id: string
}

const toneIcons: Record<ToastTone, LucideIcon> = {
  success: CircleCheck,
  error: CircleX,
  info: Info,
  accent: Zap,
}

const toneColors: Record<ToastTone, string> = {
  success: 'var(--success)',
  error: 'var(--destructive)',
  info: 'var(--info)',
  accent: 'var(--tollerud-yellow)',
}

type ToastContextValue = (input: ToastInput) => void

const ToastContext = createContext<ToastContextValue | null>(null)

export interface ToastProviderProps {
  children: ReactNode
}

const DEFAULT_TOAST_DURATION_MS = 4500

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  const push = useCallback((input: ToastInput) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((current) => [...current, { id, ...input }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, input.duration ?? DEFAULT_TOAST_DURATION_MS)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="tollerud-toaster" aria-live="polite" aria-relevant="additions">
        {toasts.map((toast) => {
          const tone = toast.tone ?? 'info'
          const Icon = toneIcons[tone]
          return (
            <div key={toast.id} className={cn('tollerud-toast')} role="status">
              <span
                className="tollerud-toast__icon"
                style={{ color: toneColors[tone] }}
                aria-hidden
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="tollerud-toast__title">{toast.title}</div>
                {toast.message ? (
                  <div className="tollerud-toast__msg">{toast.message}</div>
                ) : null}
              </div>
              <button
                type="button"
                className="tollerud-toast__dismiss tollerud-focus-ring"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
              >
                <X size={16} aria-hidden />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextValue {
  const push = useContext(ToastContext)
  if (!push) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return push
}

export { ToastProvider, useToast }

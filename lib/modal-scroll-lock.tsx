'use client'

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { RemoveScroll } from 'react-remove-scroll'
import { cn } from '@/lib/utils'

type ShardRef = RefObject<HTMLElement | null>

export interface ModalScrollLockShardsContextValue {
  registerShard: (element: HTMLElement) => void
  unregisterShard: (element: HTMLElement) => void
}

export const ModalScrollLockShardsContext =
  createContext<ModalScrollLockShardsContextValue | null>(null)

export function useModalScrollLockShards(): ModalScrollLockShardsContextValue | null {
  return useContext(ModalScrollLockShardsContext)
}

/** Track Radix dialog content open state via data-state on the content node. */
export function useDialogContentOpenState(
  contentRef: RefObject<HTMLElement | null>,
): boolean {
  const [open, setOpen] = useState(false)

  useLayoutEffect(() => {
    let observer: MutationObserver | undefined
    let frame = 0

    const bind = () => {
      const source = contentRef.current
      if (!source) return false

      const sync = () => setOpen(source.getAttribute('data-state') === 'open')
      sync()
      observer = new MutationObserver(sync)
      observer.observe(source, { attributes: true, attributeFilter: ['data-state'] })
      return true
    }

    if (!bind()) {
      frame = requestAnimationFrame(() => {
        bind()
      })
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      observer?.disconnect()
      setOpen(false)
    }
  }, [contentRef])

  return open
}

/** Copy data-state from dialog content to a custom overlay (Radix Overlay replacement). */
export function useMirrorDataState(
  sourceRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const source = sourceRef.current
    const target = targetRef.current
    if (!source || !target) return

    const sync = () => {
      const state = source.getAttribute('data-state')
      if (state) target.setAttribute('data-state', state)
    }

    sync()
    const observer = new MutationObserver(sync)
    observer.observe(source, { attributes: true, attributeFilter: ['data-state'] })
    return () => observer.disconnect()
  }, [sourceRef, targetRef])
}

/** Register a portalled panel with the nearest modal scroll-lock provider (Sheet/Dialog). */
export function useRegisterScrollLockPortalShard(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const modalShards = useModalScrollLockShards()

  useLayoutEffect(() => {
    if (!enabled || !modalShards) return

    let cleanup: (() => void) | undefined
    let frame = 0

    const register = () => {
      const element = elementRef.current
      if (!element) return false
      modalShards.registerShard(element)
      cleanup = () => modalShards.unregisterShard(element)
      return true
    }

    if (!register()) {
      frame = requestAnimationFrame(() => {
        register()
      })
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      cleanup?.()
    }
  }, [enabled, elementRef, modalShards])
}

export interface ModalScrollLockProviderProps {
  contentRef: RefObject<HTMLElement | null>
  overlayClassName?: string
  children: ReactNode
}

/**
 * Wraps Sheet/Dialog portal children: provides scroll-lock shard registration to
 * descendants (including portalled Select/Combobox lists) and renders the scrim.
 *
 * Must be a direct child of DialogPrimitive.Portal so Radix Presence unmounts on close.
 */
export function ModalScrollLockProvider({
  contentRef,
  overlayClassName,
  children,
}: ModalScrollLockProviderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [portalShardRefs, setPortalShardRefs] = useState<ShardRef[]>([])
  const open = useDialogContentOpenState(contentRef)

  useMirrorDataState(contentRef, overlayRef)

  const registerShard = useCallback((element: HTMLElement) => {
    setPortalShardRefs((prev) => {
      if (prev.some((ref) => ref.current === element)) return prev
      return [...prev, { current: element }]
    })
  }, [])

  const unregisterShard = useCallback((element: HTMLElement) => {
    setPortalShardRefs((prev) => prev.filter((ref) => ref.current !== element))
  }, [])

  const contextValue = useMemo(
    () => ({ registerShard, unregisterShard }),
    [registerShard, unregisterShard],
  )

  return (
    <ModalScrollLockShardsContext.Provider value={contextValue}>
      <RemoveScroll enabled={open} shards={[contentRef, ...portalShardRefs]} allowPinchZoom>
        <div ref={overlayRef} aria-hidden className={cn(overlayClassName)} />
      </RemoveScroll>
      {children}
    </ModalScrollLockShardsContext.Provider>
  )
}

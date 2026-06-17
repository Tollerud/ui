'use client'

import { useLayoutEffect, useSyncExternalStore, type RefObject } from 'react'

type ShardRef = RefObject<HTMLElement | null>

const shardRefs = new Set<ShardRef>()
const listeners = new Set<() => void>()
let shardVersion = 0
let cachedShardVersion = -1
let cachedShardSnapshot: ShardRef[] = []

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getShardSnapshot(): ShardRef[] {
  if (cachedShardVersion === shardVersion) return cachedShardSnapshot
  cachedShardVersion = shardVersion
  cachedShardSnapshot = Array.from(shardRefs)
  return cachedShardSnapshot
}

function notifyShardListeners() {
  shardVersion += 1
  listeners.forEach((listener) => listener())
}

/** Refs for portalled menus (Select, Combobox, DropdownMenu) passed to RemoveScroll shards. */
export function useScrollLockPortalShardRefs(): ShardRef[] {
  return useSyncExternalStore(subscribe, getShardSnapshot, getShardSnapshot)
}

export function registerScrollLockPortalShard(element: HTMLElement): () => void {
  const ref: ShardRef = { current: element }
  shardRefs.add(ref)
  notifyShardListeners()
  return () => {
    shardRefs.delete(ref)
    notifyShardListeners()
  }
}

/** Register a portalled panel while it is open so modal scroll-lock allows wheel/touch scroll. */
export function useRegisterScrollLockPortalShard(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useLayoutEffect(() => {
    if (!enabled) return

    let cleanup: (() => void) | undefined
    let frame = 0

    const register = () => {
      const element = elementRef.current
      if (!element) return false
      cleanup = registerScrollLockPortalShard(element)
      return true
    }

    if (!register()) {
      frame = requestAnimationFrame(() => register())
    }

    return () => {
      if (frame) cancelAnimationFrame(frame)
      cleanup?.()
    }
  }, [enabled, elementRef])
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

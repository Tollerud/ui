'use client'

import { useSyncExternalStore } from 'react'

/** Tailwind `md` breakpoint — viewports below 768px. */
const MOBILE_MEDIA_QUERY = '(max-width: 767px)'

function subscribe(onStoreChange: () => void) {
  if (typeof window.matchMedia !== 'function') return () => {}
  const mq = window.matchMedia(MOBILE_MEDIA_QUERY)
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getSnapshot() {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia(MOBILE_MEDIA_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

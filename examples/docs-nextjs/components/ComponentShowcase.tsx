'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { PreviewFrame } from './PreviewFrame'

interface ComponentShowcaseProps {
  children: React.ReactNode
  /** Source code to display in the code tab */
  code: string
  /** Optional language override (default: 'tsx') */
  language?: string
  /** Optional className for the wrapper */
  className?: string
}

/**
 * Component preview with integrated code tab and device selector.
 * Renders the child component in a PreviewFrame that toggles between
 * live preview (with Desktop/Tablet/Mobile sizing) and source code.
 */
export function ComponentShowcase({
  children,
  code,
  language = 'tsx',
  className,
}: ComponentShowcaseProps) {
  return (
    <div className={cn(className)}>
      <PreviewFrame code={code} codeLanguage={language}>
        {children}
      </PreviewFrame>
    </div>
  )
}
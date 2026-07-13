#!/usr/bin/env node
/**
 * Rasterizes the Tollerud monogram (components/monogram-geometry.ts) to PNGs for
 * email, where inline SVG is stripped by Gmail/Outlook. Two variants:
 *   - email-monogram-dark.png    → dark mark, for LIGHT email backgrounds (default)
 *   - email-monogram-yellow.png  → yellow mark, for DARK backgrounds (dark-mode swap)
 *
 * Output goes to brand/ (source) and docs-app/public/brand/ (served at
 * design.tollerud.dev/brand/…, which the email primitives point to by default).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const root = join(import.meta.dirname, '..')
const geo = readFileSync(join(root, 'components/monogram-geometry.ts'), 'utf8')
const viewBox = geo.match(/MONOGRAM_VIEW_BOX\s*=\s*['"]([^'"]+)/)[1]
const path = geo.match(/MONOGRAM_PATH\s*=\s*\n?\s*['"]([^'"]+)/)[1]

const HEIGHT = 120 // logical px; deviceScaleFactor doubles it for retina crispness
const [, , vbW, vbH] = viewBox.split(' ').map(Number)
const width = Math.round(HEIGHT * (vbW / vbH))

function svg(fill) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${HEIGHT}" viewBox="${viewBox}"><path d="${path}" fill="${fill}" fill-rule="evenodd"/></svg>`
}

const variants = [
  { name: 'email-monogram-dark.png', fill: '#0A0A0A' },
  { name: 'email-monogram-yellow.png', fill: '#FFFF00' },
]

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 2 })
for (const { name, fill } of variants) {
  await page.setContent(
    `<!doctype html><body style="margin:0">${svg(fill)}</body>`,
    { waitUntil: 'load' },
  )
  const el = await page.$('svg')
  for (const dir of ['brand', 'docs-app/public/brand']) {
    await el.screenshot({ path: join(root, dir, name), omitBackground: true })
  }
  console.log(`gen-email-monogram: wrote ${name} (${fill}) ${width}x${HEIGHT}@2x`)
}
await browser.close()

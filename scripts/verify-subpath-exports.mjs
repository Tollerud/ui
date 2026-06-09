#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs'

const samples = ['button', 'card', 'dialog', 'utils']

for (const name of samples) {
  const js = `dist/${name}.js`
  const dts = `dist/${name}.d.ts`
  if (!existsSync(js)) {
    console.error(`Missing subpath bundle: ${js}`)
    process.exit(1)
  }
  if (!existsSync(dts)) {
    console.error(`Missing subpath types: ${dts}`)
    process.exit(1)
  }
  const source = readFileSync(js, 'utf8')
  if (!source.startsWith("'use client'")) {
    console.error(`${js} is missing 'use client' directive`)
    process.exit(1)
  }
}

console.log(`Verified ${samples.length} subpath exports in dist/`)

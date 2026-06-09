#!/usr/bin/env node
/**
 * Minimal static file server with SPA fallback for Playwright E2E.
 */
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const port = Number(process.env.PORT || 4173)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
}

createServer((req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url || '/', `http://127.0.0.1:${port}`).pathname
  )
  let file = join(root, pathname === '/' ? 'index.html' : pathname.slice(1))

  if (!existsSync(file) || statSync(file).isDirectory()) {
    file = join(root, 'index.html')
  }

  try {
    const body = readFileSync(file)
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404).end('Not found')
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`SPA server at http://127.0.0.1:${port}`)
})

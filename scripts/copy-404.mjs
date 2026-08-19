import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(__dirname, '..', 'dist')
const index = path.join(dist, 'index.html')
const fallback = path.join(dist, '404.html')

try {
  await fs.copyFile(index, fallback)
  console.log('✓ Copied index.html → 404.html for GitHub Pages SPA routing')
} catch (err) {
  console.warn('Could not copy 404.html (dist may not exist yet):', err.message)
}

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'assets', 'audio')
fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(path.join(dir, '.gitkeep'), '')

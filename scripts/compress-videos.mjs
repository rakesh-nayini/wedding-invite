import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public', 'assets', 'video')

const jobs = [
  { src: path.join(root, 'Asritha .mp4'), dest: path.join(outDir, 'asritha-web.mp4') },
  { src: path.join(root, 'Rakesh Reddy .mp4'), dest: path.join(outDir, 'rakesh-reddy-web.mp4') },
]

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))))
  })
}

fs.mkdirSync(outDir, { recursive: true })

for (const { src, dest } of jobs) {
  if (!fs.existsSync(src)) {
    console.warn(`Skip missing ${path.basename(src)}`)
    continue
  }
  const tmp = `${dest}.part.mp4`
  console.log(`Compressing ${path.basename(src)} → ${path.basename(dest)}`)
  await run([
    '-y',
    '-i',
    src,
    '-vf',
    'scale=-2:720',
    '-c:v',
    'libx264',
    '-crf',
    '28',
    '-preset',
    'veryfast',
    '-c:a',
    'aac',
    '-b:a',
    '96k',
    '-movflags',
    '+faststart',
    tmp,
  ])
  fs.copyFileSync(tmp, dest)
  fs.unlinkSync(tmp)
  const mb = (fs.statSync(dest).size / (1024 * 1024)).toFixed(1)
  console.log(`✓ ${path.basename(dest)} (${mb} MB)`)
}

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'public', 'assets', 'images')
const jobs = [
  ['brideslide0.jpeg', 'slide-0-bride'],
  ['brideslide0.1.jpeg', 'slide-0b-bride'],
  ['grromslide0.jpeg', 'slide-0-groom'],
  ['grromslide0.1.jpeg', 'slide-0b-groom'],
  ['slide1.jpeg', 'slide-1'],
  ['slide2.jpeg', 'slide-2'],
  ['slide3.jpeg', 'slide-3'],
  ['slide4.jpeg', 'slide-4'],
  ['slide5.jpeg', 'slide-5'],
]
const widths = [640, 1080, 1920]

for (const [src, slug] of jobs) {
  const input = path.join(root, src)
  if (!fs.existsSync(input)) {
    console.warn('missing', src)
    continue
  }
  for (const width of widths) {
    const jpegOut = path.join(out, `${slug}-${width}.jpg`)
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality: width <= 640 ? 76 : 83, mozjpeg: true })
      .toFile(jpegOut)
    console.log('ok', `${slug}-${width}`)
  }
}

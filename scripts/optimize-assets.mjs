import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sourceDir = root
const outImages = path.join(root, 'public', 'assets', 'images')
const outVideo = path.join(root, 'public', 'assets', 'video')

const IMAGE_MAP = {
  'ABS03709.jpg.jpeg': 'hero',
  'ABS04067.jpg.jpeg': 'story-1',
  'ABS04381.jpg.jpeg': 'story-2',
  'ABS04736.jpg.jpeg': 'story-3',
  'ABS04959.jpg.jpeg': 'story-4',
  'ABS05245.jpg.jpeg': 'gallery-1',
  'ABS05477.jpg.jpeg': 'gallery-2',
  'ABS05624.jpg.jpeg': 'gallery-3',
  'ABS05880.jpg.jpeg': 'gallery-4',
  'ABS05924.jpg.jpeg': 'gallery-5',
  'ABS06046.jpg.jpeg': 'gallery-6',
  'ABS06137.jpg.jpeg': 'gallery-7',
  'ABS06182.jpg.jpeg': 'gallery-8',
  'slide1.jpeg': 'slide-1',
  'slide2.jpeg': 'slide-2',
  'slide3.jpeg': 'slide-3',
  'slide4.jpeg': 'slide-4',
  'brideslide0.jpeg': 'slide-0-bride',
  'grromslide0.jpeg': 'slide-0-groom',
  'brideengagementplace.jpeg': 'engagement-bride',
  'groomengagementplace.jpeg': 'engagement-groom',
  'underwedding.jpeg': 'story-wedding',
  'underrecepsection.jpeg': 'story-reception',
  'DSC_6742 copy.jpg.jpeg': 'gallery-9',
  'DSC_6842 copy.jpg.jpeg': 'gallery-10',
  'DSC_6951 copy.jpg.jpeg': 'gallery-11',
  'DSC_7589 copy.jpg.jpeg': 'gallery-12',
  'DSC_7679 copy.jpg.jpeg': 'gallery-13',
  'DSC_7698 copy.jpg.jpeg': 'gallery-14',
}

const WIDTHS = [640, 1080, 1920]

async function ensureDirs() {
  await fs.mkdir(outImages, { recursive: true })
  await fs.mkdir(outVideo, { recursive: true })
}

async function optimizeImages() {
  for (const [sourceName, slug] of Object.entries(IMAGE_MAP)) {
    const input = path.join(sourceDir, sourceName)
    try {
      await fs.access(input)
    } catch {
      console.warn(`Skipping missing file: ${sourceName}`)
      continue
    }

    for (const width of WIDTHS) {
      const webpOut = path.join(outImages, `${slug}-${width}.webp`)
      const jpegOut = path.join(outImages, `${slug}-${width}.jpg`)

      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: width <= 640 ? 72 : width <= 1080 ? 78 : 82 })
        .toFile(webpOut)

      await sharp(input)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: width <= 640 ? 75 : 82, mozjpeg: true })
        .toFile(jpegOut)

      console.log(`✓ ${slug}-${width}`)
    }
  }
}

async function copyVideos() {
  const videos = [
    { src: 'Asritha .mp4', dest: 'asritha.mp4' },
    { src: 'Rakesh Reddy .mp4', dest: 'rakesh-reddy.mp4' },
  ]

  for (const { src, dest } of videos) {
    const input = path.join(sourceDir, src)
    const output = path.join(outVideo, dest)
    try {
      await fs.copyFile(input, output)
      console.log(`✓ video ${dest}`)
    } catch {
      console.warn(`Skipping missing video: ${src}`)
    }
  }
}

async function main() {
  await ensureDirs()
  await optimizeImages()
  await copyVideos()
  console.log('\nAsset optimization complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

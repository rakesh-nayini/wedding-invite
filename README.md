# Asritha & Rakesh — Wedding Invitation

Static React site for GitHub Pages. No backend.

## What to upload

Upload **this project folder**, but **not** the huge original camera files. GitHub rejects files over 100 MB.

**Include**

- `src/`, `public/`, `scripts/`, `.github/`
- `package.json`, `package-lock.json`, `index.html`, Vite/Tailwind/TS config
- Optimized photos in `public/assets/images/`
- Compressed films in `public/assets/video/` (must stay under 100 MB each)

**Leave out** (already in `.gitignore`)

- `node_modules/`
- Originals: `ABS*.jpg.jpeg`, `DSC_*.jpg.jpeg`, `slide*.jpeg`, engagement JPEGs, `Asritha .mp4`, `Rakesh Reddy .mp4`

Guest links after publish:

- `https://YOURUSER.github.io/REPO/?invite=bride`
- `https://YOURUSER.github.io/REPO/?invite=groom`

`vite.config.ts` uses `base: './'`, so any repo name works.

## GitHub Pages (first time)

1. On GitHub: **New repository** (public). Do not add a README.
2. Install Git if needed, then in this folder:

```bash
git init -b main
git add .
git commit -m "Wedding invitation site"
git remote add origin https://github.com/YOURUSER/YOURREPO.git
git push -u origin main
```

3. Repo **Settings → Pages**:
   - Source: **GitHub Actions**  
   or **Deploy from a branch** → `gh-pages` / `/ (root)` after the first workflow run.
4. **Actions** tab: wait for **Deploy GitHub Pages**. Enable Pages if GitHub asks.

The workflow builds from the files already in `public/assets/` (it does not re-process the camera originals).

## Edit later, then update the live site

```bash
npm install
npm run dev
```

Change copy in `src/data/wedding.ts`. New photos: add files, map them in `scripts/optimize-assets.mjs`, run `npm run optimize-assets`, then commit `public/assets/images/`.

```bash
git add .
git commit -m "Update invitation"
git push
```

Pushing `main` deploys again.

## Local

Requires Node.js 18+.

```bash
npm install
npm run dev
```

- http://localhost:5173/?invite=bride
- http://localhost:5173/?invite=groom

Optional music: `public/assets/audio/theme.mp3`.

## Videos

Original films are ~124 MB and **cannot** go on GitHub. Compress once (needs `ffmpeg-static`):

```bash
npm install --save-dev ffmpeg-static
npm run compress-videos
```

That writes `asritha-web.mp4` and `rakesh-reddy-web.mp4` (~3 MB each) for Pages.

const fs = require("fs")
const path = require("path")

const PAPERS_DIR = path.join(__dirname, "../docs/papers")
const PUBLIC_DIR = path.join(__dirname, "../public/papers")

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

if (!fs.existsSync(PAPERS_DIR)) process.exit(0)

for (const slug of fs.readdirSync(PAPERS_DIR)) {
  const figDir = path.join(PAPERS_DIR, slug, "figures")
  if (!fs.existsSync(figDir)) continue
  copyDir(figDir, path.join(PUBLIC_DIR, slug, "figures"))
  console.log(`Copied figures for ${slug}`)
}

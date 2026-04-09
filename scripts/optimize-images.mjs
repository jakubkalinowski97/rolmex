import sharp from "sharp";
import { readdir, stat, rename, unlink } from "fs/promises";
import { join, extname } from "path";

const IMAGE_DIR = "public/images";
const MAX_SIZE_KB = 300; // Only process images larger than this
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

async function getImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getImages(fullPath)));
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const { size } = await stat(filePath);
  const sizeKB = size / 1024;

  if (sizeKB <= MAX_SIZE_KB) {
    return null; // Skip small images
  }

  const ext = extname(filePath).toLowerCase();
  const image = sharp(filePath);
  const metadata = await image.metadata();

  // Resize if dimensions exceed max
  const needsResize =
    (metadata.width && metadata.width > MAX_WIDTH) ||
    (metadata.height && metadata.height > MAX_HEIGHT);

  let pipeline = sharp(filePath);

  if (needsResize) {
    pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  } else if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: JPEG_QUALITY });
  }

  const tmpPath = filePath + ".tmp";
  await pipeline.toFile(tmpPath);

  const { size: newSize } = await stat(tmpPath);
  const newSizeKB = newSize / 1024;
  const saved = sizeKB - newSizeKB;

  // Only replace if we actually saved space
  if (newSizeKB < sizeKB) {
    await unlink(filePath);
    await rename(tmpPath, filePath);
    return { file: filePath, before: sizeKB, after: newSizeKB, saved };
  } else {
    await unlink(tmpPath);
    return null;
  }
}

async function main() {
  console.log(`\n🖼️  Optimizing images > ${MAX_SIZE_KB}KB in ${IMAGE_DIR}/\n`);

  const images = await getImages(IMAGE_DIR);
  let totalSaved = 0;
  let optimized = 0;

  for (const img of images) {
    const result = await optimizeImage(img);
    if (result) {
      console.log(
        `  ✅ ${result.file} — ${result.before.toFixed(0)}KB → ${result.after.toFixed(0)}KB (saved ${result.saved.toFixed(0)}KB)`
      );
      totalSaved += result.saved;
      optimized++;
    }
  }

  if (optimized === 0) {
    console.log("  All images are already optimized.\n");
  } else {
    console.log(
      `\n  📦 ${optimized} image(s) optimized, total saved: ${(totalSaved / 1024).toFixed(1)}MB\n`
    );
  }
}

main().catch((err) => {
  console.error("Image optimization failed:", err);
  process.exit(1);
});

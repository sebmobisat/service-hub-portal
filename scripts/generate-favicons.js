const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function generate() {
  const srcPng = path.resolve(__dirname, '..', 'images', 'serviceHub.png');
  const outDir = path.resolve(__dirname, '..', 'favicon');
  await ensureDir(outDir);

  // PNG sizes
  const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 512];
  await Promise.all(
    sizes.map(size =>
      sharp(srcPng)
        .resize(size, size)
        .png()
        .toFile(path.join(outDir, `favicon-${size}x${size}.png`))
    )
  );

  // Apple touch icon 180x180
  await sharp(srcPng).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));

  // Single-frame ICO (32x32) - sharp can output ico directly when input is PNG
  const b32 = await sharp(srcPng).resize(32, 32).toFormat('png').toBuffer();
  // Simple ICO header generator for single image
  function pngToIcoSingle(pngBuffer) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // ICO type
    header.writeUInt16LE(1, 4); // count
    const dir = Buffer.alloc(16);
    dir[0] = 32; // width
    dir[1] = 32; // height
    dir[2] = 0; // colors
    dir[3] = 0; // reserved
    dir.writeUInt16LE(1, 4); // color planes
    dir.writeUInt16LE(32, 6); // bpp
    dir.writeUInt32LE(pngBuffer.length, 8); // size
    dir.writeUInt32LE(6 + 16, 12); // offset
    return Buffer.concat([header, dir, pngBuffer]);
  }
  await fs.promises.writeFile(path.join(outDir, 'favicon.ico'), pngToIcoSingle(b32));

  // Copy svg if exists
  const srcSvg = path.resolve(__dirname, '..', 'images', 'serviceHub.svg');
  if (fs.existsSync(srcSvg)) {
    await fs.promises.copyFile(srcSvg, path.join(outDir, 'favicon.svg'));
  }

  // Generate manifest snippet
  const manifest = {
    icons: sizes.map(s => ({ src: `/favicon/favicon-${s}x${s}.png`, sizes: `${s}x${s}`, type: 'image/png' })),
    apple: '/favicon/apple-touch-icon.png',
    ico: '/favicon/favicon.ico',
    svg: fs.existsSync(srcSvg) ? '/favicon/favicon.svg' : undefined
  };
  await fs.promises.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('Favicons generated in /favicon');
}

generate().catch(err => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});



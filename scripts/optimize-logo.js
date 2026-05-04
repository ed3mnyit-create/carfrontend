const sharp = require("sharp");

async function optimizeLogo() {
  await sharp("public/images/logo.jpeg")
    .resize(400)
    .jpeg({ quality: 90 })
    .toFile("public/images/logo-optimized.jpeg");

  await sharp("public/images/logo.jpeg")
    .resize(400)
    .webp({ quality: 90 })
    .toFile("public/images/logo.webp");

  await sharp("public/images/logo.jpeg")
    .resize(32, 32)
    .toFile("app/favicon.ico");
}

optimizeLogo().catch((error) => {
  console.error("Failed to optimize logo:", error);
  process.exit(1);
});

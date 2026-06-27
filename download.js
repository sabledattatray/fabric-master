import fs from 'fs';

async function downloadImage() {
  console.log("Attempting to download the avatar via fetch...");
  
  // If the file already exists and is non-empty, we can skip or ignore errors
  const fileExists = fs.existsSync("public/og-image.jpg");
  if (fileExists) {
    try {
      const stats = fs.statSync("public/og-image.jpg");
      if (stats.size > 1000) {
        console.log("og-image.jpg already exists and is valid. Skipping download.");
        return;
      }
    } catch (e) {
      // ignore
    }
  }

  try {
    const response = await fetch("https://avatars.githubusercontent.com/u/sabledattatray?v=4", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.promises.writeFile("public/og-image.jpg", buffer);
    console.log("Download completed successfully via fetch. File size:", buffer.length);
  } catch (error) {
    console.warn("WARNING: Error downloading image from GitHub, using fallback or existing file:", error.message);
    // Do not crash the build if the external resource is unavailable
  }
}

downloadImage();

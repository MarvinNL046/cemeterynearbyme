#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import { createWriteStream } from 'fs';

interface BestPhoto {
  photo: string;
  gemeente: string;
  rating: string;
}

// Download images locally to avoid 403 errors
async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filepath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

async function downloadProvincePhotos() {
  const dataPath = path.join(__dirname, '..', 'data', 'best-province-photos.json');
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'provinces');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  const provincePhotos = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Record<string, BestPhoto>;
  
  for (const [province, data] of Object.entries(provincePhotos)) {
    const filename = `${province.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    const filepath = path.join(imagesDir, filename);
    
    // Skip Street View images as they need API key
    if (data.photo.includes('streetviewpixels')) {
      console.log(`⚠️  Skipping Street View image for ${province}`);
      continue;
    }
    
    try {
      console.log(`Downloading image for ${province}...`);
      await downloadImage(data.photo, filepath);
      console.log(`✅ Downloaded: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to download ${province}:`, error);
    }
  }
  
  console.log('\n✅ Download complete!');
}

downloadProvincePhotos().catch(console.error);
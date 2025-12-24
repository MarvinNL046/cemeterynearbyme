#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

interface Cemetery {
  naam_begraafplaats: string;
  provincie: string;
  gemeente: string;
  photo?: string;
  rating?: string;
}

// Get the best photos for each province based on ratings
async function getBestProvincePhotos() {
  const dataPath = path.join(__dirname, '..', 'public', 'data', 'cemeteries.json');
  const cemeteries = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Cemetery[];
  
  // Group by province and get the best photo
  const provincePhotos: Record<string, { photo: string; cemetery: string; gemeente: string; rating: string }> = {};
  
  cemeteries.forEach(cemetery => {
    if (cemetery.photo && cemetery.provincie) {
      const rating = parseFloat(cemetery.rating || '0');
      
      if (!provincePhotos[cemetery.provincie] || 
          parseFloat(provincePhotos[cemetery.provincie].rating) < rating) {
        provincePhotos[cemetery.provincie] = {
          photo: cemetery.photo,
          cemetery: cemetery.naam_begraafplaats,
          gemeente: cemetery.gemeente,
          rating: cemetery.rating || '0'
        };
      }
    }
  });
  
  // Log results
  console.log('\nBest photo for each province:');
  Object.entries(provincePhotos).forEach(([province, data]) => {
    console.log(`\n${province}:`);
    console.log(`  Cemetery: ${data.cemetery} (${data.gemeente})`);
    console.log(`  Rating: ${data.rating}`);
    console.log(`  Photo: ${data.photo.substring(0, 50)}...`);
  });
  
  // Save the result
  const outputPath = path.join(__dirname, '..', 'data', 'best-province-photos.json');
  fs.writeFileSync(outputPath, JSON.stringify(provincePhotos, null, 2));
  
  console.log(`\n✅ Saved best province photos to ${outputPath}`);
}

getBestProvincePhotos().catch(console.error);
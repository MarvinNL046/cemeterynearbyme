#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

interface Cemetery {
  provincie: string;
  photo?: string;
  rating?: string;
  gemeente: string;
}

// Get photos for each province from our scraped data - only Google Places photos
async function getProvincePhotos() {
  const dataPath = path.join(__dirname, '..', 'public', 'data', 'cemeteries.json');
  const cemeteries = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as Cemetery[];
  
  const provincePhotos: Record<string, { photo: string; gemeente: string; rating?: string }[]> = {};
  
  // Collect only Google Places photos per province
  cemeteries.forEach(cemetery => {
    if (cemetery.photo && cemetery.provincie && 
        cemetery.photo.includes('lh3.googleusercontent.com')) {
      if (!provincePhotos[cemetery.provincie]) {
        provincePhotos[cemetery.provincie] = [];
      }
      
      provincePhotos[cemetery.provincie].push({
        photo: cemetery.photo,
        gemeente: cemetery.gemeente,
        rating: cemetery.rating
      });
    }
  });
  
  // Sort by rating and pick top photos per province
  const topPhotos: Record<string, string[]> = {};
  
  Object.entries(provincePhotos).forEach(([province, photos]) => {
    // Sort by rating (if available) and take top 6
    const sorted = photos.sort((a, b) => {
      const ratingA = a.rating ? parseFloat(a.rating) : 0;
      const ratingB = b.rating ? parseFloat(b.rating) : 0;
      return ratingB - ratingA;
    });
    
    topPhotos[province] = sorted.slice(0, 6).map(p => p.photo);
    
    console.log(`${province}: ${topPhotos[province].length} Google Places photos found`);
  });
  
  // Save the result
  const outputPath = path.join(__dirname, '..', 'data', 'province-photos-places.json');
  fs.writeFileSync(outputPath, JSON.stringify(topPhotos, null, 2));
  
  console.log(`\n✅ Saved province photos to ${outputPath}`);
}

getProvincePhotos().catch(console.error);
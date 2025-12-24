import fs from 'fs';
import path from 'path';

const DATA_FILE = 'data/begraafplaatsen.json';
const PHOTOS_DIR = 'public/images/google';

// Load data
const cemeteries = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const photoFiles = fs.readdirSync(PHOTOS_DIR);

console.log(`📊 Foto's op disk: ${photoFiles.length}`);
console.log(`📊 Entries in data: ${cemeteries.length}`);

let matched = 0;
let alreadyHad = 0;

// Create lookup map from filename (without extension) to full path
const photoMap = new Map<string, string>();
for (const file of photoFiles) {
  const slug = file.replace(/\.(jpg|jpeg|png|webp)$/i, '');
  photoMap.set(slug, `/images/google/${file}`);
}

// Match photos to entries
for (const cemetery of cemeteries) {
  if (cemetery.google_photo) {
    alreadyHad++;
    continue;
  }

  const slug = cemetery.slug;
  if (photoMap.has(slug)) {
    cemetery.google_photo = photoMap.get(slug);
    matched++;
  }
}

console.log('');
console.log(`✅ Al gekoppeld: ${alreadyHad}`);
console.log(`🔗 Nieuw gekoppeld: ${matched}`);
console.log(`📊 Totaal met foto: ${alreadyHad + matched}`);

// Save
fs.writeFileSync(DATA_FILE, JSON.stringify(cemeteries, null, 2));
console.log('');
console.log('💾 Data opgeslagen!');

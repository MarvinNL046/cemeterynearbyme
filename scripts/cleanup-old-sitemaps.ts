import fs from 'fs';
import path from 'path';

// Script to clean up old static sitemap files
// Now that we use dynamic sitemap generation in Next.js

const publicDir = path.join(process.cwd(), 'public');

// Old sitemap files to remove
const oldSitemapFiles = [
  'sitemap-main.xml',
  'sitemap-gemeenten-1.xml',
  'sitemap-gemeenten-2.xml',
  'sitemap-begraafplaatsen-1.xml',
  'sitemap-begraafplaatsen-2.xml',
  'sitemap-begraafplaatsen-3.xml',
  'sitemap-begraafplaatsen-4.xml',
  'sitemap.xml', // Old static sitemap
];

// Remove old sitemap directory
const sitemapsDir = path.join(publicDir, 'sitemaps');

console.log('🧹 Cleaning up old sitemap files...');

// Remove individual files
oldSitemapFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✅ Removed: ${file}`);
  }
});

// Remove sitemaps directory
if (fs.existsSync(sitemapsDir)) {
  fs.rmSync(sitemapsDir, { recursive: true, force: true });
  console.log('✅ Removed: sitemaps directory');
}

console.log('\n✨ Cleanup complete!');
console.log('📝 Note: Next.js will now generate sitemap.xml dynamically at /sitemap.xml');
console.log('🚀 This happens automatically when you build or run the app!');
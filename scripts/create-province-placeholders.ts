#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';

const provinces = [
  { name: 'Noord-Holland', color: '#1e40af' }, // blue
  { name: 'Zuid-Holland', color: '#dc2626' }, // red
  { name: 'Utrecht', color: '#16a34a' }, // green
  { name: 'Noord-Brabant', color: '#7c3aed' }, // purple
  { name: 'Gelderland', color: '#ea580c' }, // orange
  { name: 'Limburg', color: '#0891b2' }, // cyan
  { name: 'Groningen', color: '#c026d3' }, // fuchsia
  { name: 'Friesland', color: '#0d9488' }, // teal
  { name: 'Drenthe', color: '#b91c1c' }, // red
  { name: 'Overijssel', color: '#4f46e5' }, // indigo
  { name: 'Flevoland', color: '#059669' }, // emerald
  { name: 'Zeeland', color: '#e11d48' }, // rose
];

function createProvinceSVG(province: string, color: string): string {
  return `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.7" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#grad)"/>
  <rect width="800" height="450" fill="${color}" opacity="0.1"/>
  <text x="400" y="225" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${province}</text>
</svg>`;
}

async function createProvincePlaceholders() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images', 'provinces');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  provinces.forEach(({ name, color }) => {
    const filename = `${name.toLowerCase().replace(/\s+/g, '-')}.svg`;
    const filepath = path.join(imagesDir, filename);
    const svg = createProvinceSVG(name, color);
    
    fs.writeFileSync(filepath, svg);
    console.log(`✅ Created: ${filename}`);
  });
  
  console.log('\n✅ All province placeholders created!');
}

createProvincePlaceholders().catch(console.error);
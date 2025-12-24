const fs = require('fs');
const data = require('../public/data/cemeteries.json');

// Generate summary
const summary = {
  total_cemeteries: data.length,
  total_provinces: [...new Set(data.map(c => c.provincie))].filter(p => p && p !== 'Onbekend').length,
  total_municipalities: [...new Set(data.map(c => c.gemeente))].filter(Boolean).length,
  total_places: [...new Set(data.map(c => c.plaats))].filter(Boolean).length,
  types: {},
  provinces: [...new Set(data.map(c => c.provincie))].filter(p => p && p !== 'Onbekend').sort(),
  municipalities: [...new Set(data.map(c => c.gemeente))].filter(Boolean).sort(),
  places: [...new Set(data.map(c => c.plaats))].filter(Boolean).sort(),
  last_updated: new Date().toISOString()
};

// Count by type
data.forEach(c => {
  const t = c.type || 'onbekend';
  summary.types[t] = (summary.types[t] || 0) + 1;
});

fs.writeFileSync('public/data/summary.json', JSON.stringify(summary, null, 2));
console.log('Summary updated');
console.log('Types:', Object.entries(summary.types).map(([k,v]) => `${k}: ${v}`).join(', '));

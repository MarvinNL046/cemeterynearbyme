#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

// Read the HTML content files
const contentDir = path.join(process.cwd(), 'content');
const blogContentPath = path.join(process.cwd(), 'lib', 'blog-content.ts');

// Read existing blog-content.ts
let blogContentFile = fs.readFileSync(blogContentPath, 'utf-8');

// Articles to add
const articlesToAdd = [
  {
    slug: 'beroemde-nederlanders-laatste-rustplaats',
    file: 'beroemde-nederlanders-laatste-rustplaats.html'
  },
  {
    slug: 'seizoenen-begraafplaats-wat-verwachten',
    file: 'seizoenen-begraafplaats-wat-verwachten.html'
  },
  {
    slug: 'crematie-versus-begraven-vergelijking',
    file: 'crematie-versus-begraven-vergelijking.html'
  }
];

// Find the position to insert new content (before the closing brace and getBlogContent function)
const insertPosition = blogContentFile.lastIndexOf('};');

if (insertPosition === -1) {
  console.error('Could not find insertion point in blog-content.ts');
  process.exit(1);
}

// Build the new content entries
let newEntries = '';

articlesToAdd.forEach(article => {
  const contentPath = path.join(contentDir, article.file);
  if (fs.existsSync(contentPath)) {
    const htmlContent = fs.readFileSync(contentPath, 'utf-8');
    
    // Convert the HTML to the format used in blog-content.ts
    // Replace article tags with div and adjust classes
    const formattedContent = htmlContent
      .replace('<article class="prose prose-lg max-w-none">', '<div class="blog-content space-y-6">')
      .replace('</article>', '</div>')
      .replace(/class="lead"/g, 'class="text-lg leading-relaxed text-gray-700"')
      .replace(/<h2>/g, '<h2 class="text-2xl font-bold text-gray-900 mb-4">')
      .replace(/<h3>/g, '<h3 class="text-xl font-semibold text-gray-900 mb-3">')
      .replace(/<p>/g, '<p class="text-gray-700 leading-relaxed mb-4">')
      .replace(/<ul>/g, '<ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">')
      .replace(/<ol>/g, '<ol class="list-decimal pl-6 space-y-2 text-gray-700 mb-4">')
      .replace(/<li>/g, '<li class="mb-1">')
      .replace(/<strong>/g, '<strong class="font-semibold">')
      .replace(/class="bg-blue-50 p-4 rounded-lg"/g, 'class="bg-blue-50 p-4 rounded-lg mb-4"');

    // Add the entry
    newEntries += `,
  '${article.slug}': \`
    ${formattedContent.trim()}
  \``;
    
    console.log(`✅ Added content for: ${article.slug}`);
  } else {
    console.log(`⚠️  Content file not found: ${article.file}`);
  }
});

// Insert the new entries
const updatedContent = blogContentFile.slice(0, insertPosition) + newEntries + '\n' + blogContentFile.slice(insertPosition);

// Write the updated file
fs.writeFileSync(blogContentPath, updatedContent);

console.log('\n✅ Successfully updated blog-content.ts!');
console.log('🔄 Please restart your development server to see the changes.');
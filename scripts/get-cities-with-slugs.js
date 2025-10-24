#!/usr/bin/env node

/**
 * Script to fetch ALL cities from database and generate slugs for prerendering
 * 
 * Usage:
 *   node scripts/get-cities-with-slugs.js
 * 
 * Output format:
 *   [
 *     { slug: "volgograd", name: "Волгоград" },
 *     { slug: "barnaul", name: "Барнаул" },
 *     ...
 *   ]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the API endpoint URL
const func2urlPath = path.join(__dirname, '..', 'backend', 'func2url.json');
const func2url = JSON.parse(fs.readFileSync(func2urlPath, 'utf8'));
const CITIES_API_URL = func2url.cities;

/**
 * Generate URL-friendly slug from Russian city name
 * Uses transliteration rules similar to what's commonly used in Russian URLs
 */
function generateSlug(cityName) {
  const translitMap = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
    'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M',
    'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
    'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
    'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
  };

  let slug = '';
  for (let char of cityName) {
    if (translitMap[char] !== undefined) {
      slug += translitMap[char];
    } else if (char === ' ' || char === '-') {
      slug += '-';
    } else if (/[a-zA-Z0-9]/.test(char)) {
      slug += char;
    }
  }

  // Clean up the slug
  slug = slug.toLowerCase()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen

  return slug;
}

async function fetchCitiesWithSlugs() {
  try {
    console.log('🔍 Fetching all cities from database...');
    console.log(`📡 API URL: ${CITIES_API_URL}`);
    console.log('');
    
    const response = await fetch(CITIES_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // The API returns cities grouped by regions
    let allCities = [];
    
    if (data.cities && typeof data.cities === 'object') {
      Object.keys(data.cities).forEach(regionName => {
        const citiesInRegion = data.cities[regionName];
        if (Array.isArray(citiesInRegion)) {
          allCities = allCities.concat(citiesInRegion);
        }
      });
    }
    
    console.log(`✅ Found ${allCities.length} active cities in database`);
    console.log('');
    
    // Generate slugs for each city
    const citiesWithSlugs = allCities.map(city => ({
      slug: generateSlug(city.name),
      name: city.name
    }));
    
    // Sort by name for better readability
    citiesWithSlugs.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    
    console.log('📋 CITIES WITH SLUGS:');
    console.log('='.repeat(80));
    citiesWithSlugs.forEach((city, index) => {
      console.log(`${(index + 1).toString().padStart(3, ' ')}. ${city.name.padEnd(30, ' ')} → ${city.slug}`);
    });
    console.log('='.repeat(80));
    console.log('');
    
    // Save to file
    const outputPath = path.join(__dirname, 'cities-with-slugs.json');
    fs.writeFileSync(outputPath, JSON.stringify(citiesWithSlugs, null, 2), 'utf8');
    console.log(`💾 Saved to: ${outputPath}`);
    
    // Also save in JavaScript format for easy copy-paste into prerender.js
    const jsOutputPath = path.join(__dirname, 'cities-with-slugs.js');
    const jsContent = `// Auto-generated list of cities with slugs
// Generated on: ${new Date().toISOString()}
// Total cities: ${citiesWithSlugs.length}

export const CITIES = ${JSON.stringify(citiesWithSlugs, null, 2)};
`;
    fs.writeFileSync(jsOutputPath, jsContent, 'utf8');
    console.log(`💾 JS format saved to: ${jsOutputPath}`);
    
    console.log('');
    console.log('✅ SUCCESS!');
    console.log(`📊 Total cities: ${citiesWithSlugs.length}`);
    
    return citiesWithSlugs;
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    throw error;
  }
}

// Run
fetchCitiesWithSlugs();
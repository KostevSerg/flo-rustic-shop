#!/usr/bin/env node

/**
 * Test script to preview what the prerender will do
 * This simulates the prerender without actually writing files
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const func2urlPath = path.join(__dirname, '..', 'backend', 'func2url.json');
const func2url = JSON.parse(fs.readFileSync(func2urlPath, 'utf8'));
const CITIES_API_URL = func2url.cities;

function generateSlug(cityName) {
  return cityName
    .toLowerCase()
    .replace(/ё/g, 'e')
    .replace(/ /g, '-')
    .replace(/а/g, 'a').replace(/б/g, 'b').replace(/в/g, 'v').replace(/г/g, 'g')
    .replace(/д/g, 'd').replace(/е/g, 'e').replace(/ж/g, 'zh').replace(/з/g, 'z')
    .replace(/и/g, 'i').replace(/й/g, 'j').replace(/к/g, 'k').replace(/л/g, 'l')
    .replace(/м/g, 'm').replace(/н/g, 'n').replace(/о/g, 'o').replace(/п/g, 'p')
    .replace(/р/g, 'r').replace(/с/g, 's').replace(/т/g, 't').replace(/у/g, 'u')
    .replace(/ф/g, 'f').replace(/х/g, 'h').replace(/ц/g, 'c').replace(/ч/g, 'ch')
    .replace(/ш/g, 'sh').replace(/щ/g, 'sch').replace(/ъ/g, '').replace(/ы/g, 'y')
    .replace(/ь/g, '').replace(/э/g, 'e').replace(/ю/g, 'yu').replace(/я/g, 'ya');
}

async function testPrerender() {
  console.log('=' .repeat(80));
  console.log('PRERENDER TEST - PREVIEW MODE');
  console.log('=' .repeat(80));
  console.log('');
  
  console.log('🔍 Fetching cities from database...');
  console.log(`📡 API URL: ${CITIES_API_URL}`);
  console.log('');
  
  try {
    const response = await fetch(CITIES_API_URL);
    const data = await response.json();
    
    let allCities = [];
    if (data.cities && typeof data.cities === 'object') {
      Object.keys(data.cities).forEach(regionName => {
        const citiesInRegion = data.cities[regionName];
        if (Array.isArray(citiesInRegion)) {
          allCities = allCities.concat(citiesInRegion);
        }
      });
    }
    
    const citiesWithSlugs = allCities.map(city => ({
      slug: generateSlug(city.name),
      name: city.name
    }));
    
    console.log(`✅ Found ${citiesWithSlugs.length} active cities`);
    console.log('');
    console.log('📋 CITIES THAT WILL BE PRERENDERED:');
    console.log('=' .repeat(80));
    
    citiesWithSlugs.forEach((city, index) => {
      const num = (index + 1).toString().padStart(3, ' ');
      const name = city.name.padEnd(30, ' ');
      console.log(`${num}. ${name} → /city/${city.slug}/index.html`);
    });
    
    console.log('=' .repeat(80));
    console.log('');
    console.log(`📊 SUMMARY:`);
    console.log(`   Total cities: ${citiesWithSlugs.length}`);
    console.log(`   Files to generate: ${citiesWithSlugs.length}`);
    console.log('');
    console.log('💡 To actually generate these files, run:');
    console.log('   node scripts/prerender.js');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPrerender();

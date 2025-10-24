#!/usr/bin/env node

/**
 * Script to fetch ALL cities with detailed information from the database
 * 
 * Usage:
 *   node scripts/get-cities-detailed.js
 * 
 * This script fetches:
 * - City ID
 * - City Name
 * - Region
 * - Timezone
 * - Working hours
 * - Address
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the API endpoint URL
const func2urlPath = path.join(__dirname, '..', 'backend', 'func2url.json');
const func2url = JSON.parse(fs.readFileSync(func2urlPath, 'utf8'));
const CITIES_API_URL = func2url.cities;

async function fetchAllCitiesDetailed() {
  try {
    console.log('🔍 Fetching all cities with detailed information...');
    console.log(`📡 API URL: ${CITIES_API_URL}`);
    console.log('');
    
    const response = await fetch(CITIES_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // The API returns cities grouped by regions
    // Format: { cities: { "Region Name": [city1, city2, ...], ... } }
    let allCities = [];
    
    if (data.cities && typeof data.cities === 'object') {
      // Extract cities from each region
      Object.keys(data.cities).forEach(regionName => {
        const citiesInRegion = data.cities[regionName];
        if (Array.isArray(citiesInRegion)) {
          allCities = allCities.concat(citiesInRegion);
        }
      });
    }
    
    console.log(`✅ Found ${allCities.length} active cities in database`);
    console.log('');
    console.log('📋 DETAILED CITIES LIST:');
    console.log('='.repeat(80));
    
    // Display detailed information
    allCities.forEach((city, index) => {
      console.log(`${index + 1}. ${city.name}`);
      console.log(`   ID: ${city.id}`);
      console.log(`   Region: ${city.region}`);
      console.log(`   Timezone: ${city.timezone || 'N/A'}`);
      console.log(`   Work Hours: ${city.work_hours || 'N/A'}`);
      console.log(`   Address: ${city.address || 'N/A'}`);
      console.log('');
    });
    
    console.log('='.repeat(80));
    
    // Also save detailed list
    const outputPath = path.join(__dirname, 'cities-detailed.json');
    fs.writeFileSync(outputPath, JSON.stringify(allCities, null, 2), 'utf8');
    console.log(`💾 Detailed list saved to: ${outputPath}`);
    
    // Save simple list for prerendering
    const citiesForPrerender = allCities.map(city => ({ name: city.name }));
    const simpleOutputPath = path.join(__dirname, 'cities-simple.json');
    fs.writeFileSync(simpleOutputPath, JSON.stringify(citiesForPrerender, null, 2), 'utf8');
    console.log(`💾 Simple list saved to: ${simpleOutputPath}`);
    
    return allCities;
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    throw error;
  }
}

// Run
fetchAllCitiesDetailed();

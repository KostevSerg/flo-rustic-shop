#!/usr/bin/env node

/**
 * Script to fetch ALL cities from the database via API
 * 
 * Usage:
 *   node scripts/get-all-cities.js
 * 
 * Output format:
 *   [
 *     { "name": "Волгоград" },
 *     { "name": "Барнаул" },
 *     ...
 *   ]
 */

import { fetchAllCities } from './fetch-cities.js';

async function main() {
  console.log('=' .repeat(60));
  console.log('FETCHING ALL CITIES FROM DATABASE');
  console.log('=' .repeat(60));
  console.log('');
  
  try {
    const cities = await fetchAllCities();
    
    console.log('');
    console.log('=' .repeat(60));
    console.log(`SUCCESS: Retrieved ${cities.length} cities`);
    console.log('=' .repeat(60));
    
    return cities;
  } catch (error) {
    console.error('');
    console.error('=' .repeat(60));
    console.error('ERROR: Failed to fetch cities');
    console.error('=' .repeat(60));
    console.error(error);
    process.exit(1);
  }
}

main();

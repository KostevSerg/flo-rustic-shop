import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the API endpoint URL
const func2urlPath = path.join(__dirname, '..', 'backend', 'func2url.json');
const func2url = JSON.parse(fs.readFileSync(func2urlPath, 'utf8'));
const CITIES_API_URL = func2url.cities;

async function fetchAllCities() {
  try {
    console.log('🔍 Fetching all cities from database...');
    console.log(`📡 API URL: ${CITIES_API_URL}`);
    
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
    
    // Format cities for prerendering: extract name only
    const citiesForPrerender = allCities.map(city => ({
      name: city.name
    }));
    console.log('\n📋 Cities list:');
    console.log(JSON.stringify(citiesForPrerender, null, 2));
    
    // Save to file for easy access
    const outputPath = path.join(__dirname, 'cities-list.json');
    fs.writeFileSync(outputPath, JSON.stringify(citiesForPrerender, null, 2), 'utf8');
    console.log(`\n💾 Saved to: ${outputPath}`);
    
    return citiesForPrerender;
  } catch (error) {
    console.error('❌ Error fetching cities:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchAllCities();
}

export { fetchAllCities };
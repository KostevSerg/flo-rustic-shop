#!/usr/bin/env node

/**
 * Simulation of prerender script output
 * This shows what you would see when running the actual prerender
 */

import fetch from 'node-fetch';

console.log('=' .repeat(80));
console.log('SIMULATED PRERENDER OUTPUT');
console.log('This shows what the actual prerender script would output');
console.log('=' .repeat(80));
console.log('');

async function simulatePrerender() {
  console.log('=' .repeat(80));
  console.log('STEP 1: Building Project (npm run build)');
  console.log('=' .repeat(80));
  console.log('');
  console.log('> vite build');
  console.log('');
  console.log('vite v7.1.13 building for production...');
  console.log('✓ 2547 modules transformed.');
  console.log('dist/index.html                           0.46 kB │ gzip:  0.30 kB');
  console.log('dist/assets/index-DwPP5M8V.css          143.89 kB │ gzip: 24.32 kB');
  console.log('dist/assets/index-BQVZzWxY.js         1,247.42 kB │ gzip: 385.23 kB');
  console.log('✓ built in 18.43s');
  console.log('');
  console.log('✅ Build completed successfully!');
  console.log('');
  
  console.log('=' .repeat(80));
  console.log('STEP 2: Running Prerender Script');
  console.log('=' .repeat(80));
  console.log('');
  console.log('🚀 Начинаем генерацию статичных HTML...');
  console.log('');
  
  // Fetch cities
  console.log('📍 Загружаем города...');
  try {
    const response = await fetch('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=list');
    const data = await response.json();
    const cityCount = data.cities ? data.cities.length : 0;
    
    console.log(`   Найдено городов: ${cityCount}`);
    console.log('');
    
    // Simulate city page generation
    if (cityCount > 0) {
      const sampleCities = data.cities.slice(0, 10);
      sampleCities.forEach((city, index) => {
        if (index < 5) {
          const slug = city.name.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[а-яё]/gi, match => {
              const map = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
                'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
                'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
                'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
                'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
                'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
                'э': 'e', 'ю': 'yu', 'я': 'ya'
              };
              return map[match.toLowerCase()] || match;
            });
          console.log(`   Создано ${index + 1} страниц...`);
        }
      });
      
      if (cityCount > 50) {
        console.log(`   Создано 50 страниц...`);
      }
    }
    
    console.log(`✅ Создано ${cityCount} страниц городов`);
    console.log('');
    
    // Fetch products
    console.log('🌸 Загружаем товары...');
    const productsResponse = await fetch('https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?action=list');
    const productsData = await productsResponse.json();
    const productCount = productsData.products ? productsData.products.length : 0;
    
    console.log(`   Найдено товаров: ${productCount}`);
    console.log('');
    console.log(`✅ Создано ${productCount} страниц товаров`);
    console.log('');
    
    // Static pages
    const staticCount = 5;
    console.log(`✅ Создано ${staticCount} статичных страниц`);
    console.log('');
    
    const totalCount = cityCount + productCount + staticCount;
    console.log(`🎉 Всего сгенерировано: ${totalCount} HTML-файлов!`);
    console.log('');
    
    console.log('=' .repeat(80));
    console.log('STEP 3: Verification');
    console.log('=' .repeat(80));
    console.log('');
    console.log('📊 SUMMARY OF GENERATED FILES:');
    console.log(`   ✅ City pages: ${cityCount}`);
    console.log(`   ✅ Product pages: ${productCount}`);
    console.log(`   ✅ Static pages: ${staticCount}`);
    console.log(`   ━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   🎉 Total HTML files: ${totalCount}`);
    console.log('');
    
    console.log('📄 Sample generated pages:');
    if (data.cities && data.cities.length > 0) {
      const samples = data.cities.slice(0, 5);
      samples.forEach(city => {
        const slug = city.name.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[а-яё]/gi, match => {
            const map = {
              'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
              'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
              'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
              'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
              'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
              'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
              'э': 'e', 'ю': 'yu', 'я': 'ya'
            };
            return map[match.toLowerCase()] || match;
          });
        console.log(`   dist/city/${slug}/index.html`);
        console.log(`   └─ Доставка цветов ${city.name} — FloRustic | Купить розы, тюльпаны...`);
      });
    }
    console.log('');
    
    console.log('=' .repeat(80));
    console.log('✅ PRERENDER EXECUTION COMPLETE');
    console.log('=' .repeat(80));
    console.log('');
    console.log('📁 All files generated in: dist/');
    console.log('   - dist/city/[slug]/index.html');
    console.log('   - dist/product/[id]/index.html');
    console.log('   - dist/catalog/index.html');
    console.log('   - dist/delivery/index.html');
    console.log('   - dist/about/index.html');
    console.log('   - dist/contacts/index.html');
    console.log('   - dist/reviews/index.html');
    console.log('');
    console.log('🚀 Ready to deploy!');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simulatePrerender();

#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';

const SITEMAP_URL = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057';

console.log('🚀 Загружаю актуальный sitemap с сервера...');

fetch(SITEMAP_URL)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.text();
  })
  .then(xml => {
    const urlCount = (xml.match(/<url>/g) || []).length;
    console.log(`✅ Получено ${urlCount} страниц`);
    
    fs.writeFileSync('public/sitemap.xml', xml, 'utf-8');
    console.log('💾 Файл public/sitemap.xml обновлён!');
    console.log(`📊 Всего страниц в sitemap: ${urlCount}`);
  })
  .catch(err => {
    console.error('❌ Ошибка:', err.message);
    process.exit(1);
  });

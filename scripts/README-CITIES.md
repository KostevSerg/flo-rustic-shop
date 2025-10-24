# Cities Fetching Scripts

This directory contains scripts to fetch cities data from the database for various purposes.

## Available Scripts

### 1. `get-all-cities.js` - Simple List
Fetches all cities and returns just the names in a simple format.

**Usage:**
```bash
node scripts/get-all-cities.js
```

**Output Format:**
```json
[
  { "name": "Волгоград" },
  { "name": "Барнаул" },
  { "name": "Москва" }
]
```

**Output File:** `scripts/cities-list.json`

---

### 2. `get-cities-detailed.js` - Full Information
Fetches all cities with complete information (ID, region, timezone, work hours, address).

**Usage:**
```bash
node scripts/get-cities-detailed.js
```

**Output Format:**
```json
[
  {
    "id": 1,
    "name": "Волгоград",
    "region": "Волгоградская область",
    "timezone": "Europe/Moscow",
    "work_hours": "09:00 - 21:00",
    "address": "ул. Ленина, 1"
  }
]
```

**Output Files:**
- `scripts/cities-detailed.json` - Full details
- `scripts/cities-simple.json` - Just names

---

### 3. `get-cities-with-slugs.js` - For Prerendering ⭐
**RECOMMENDED for prerendering!**

Fetches all cities and generates URL-friendly slugs for each city.

**Usage:**
```bash
node scripts/get-cities-with-slugs.js
```

**Output Format:**
```json
[
  { "slug": "volgograd", "name": "Волгоград" },
  { "slug": "barnaul", name: "Барнаул" },
  { "slug": "moscow", "name": "Москва" }
]
```

**Output Files:**
- `scripts/cities-with-slugs.json` - JSON format
- `scripts/cities-with-slugs.js` - JavaScript export format

---

## How to Use with Prerendering

### Step 1: Fetch Cities from Database
```bash
node scripts/get-cities-with-slugs.js
```

This will:
1. Connect to the database via API
2. Fetch all active cities
3. Generate URL slugs using transliteration
4. Save to `cities-with-slugs.js`

### Step 2: Update Prerender Script
Copy the CITIES array from `scripts/cities-with-slugs.js` to `scripts/prerender.js`:

```javascript
// In scripts/prerender.js
import { CITIES } from './cities-with-slugs.js';

// Or manually copy the array:
const CITIES = [
  { slug: 'volgograd', name: 'Волгоград' },
  { slug: 'barnaul', name: 'Барнаул' },
  // ... all cities from database
];
```

### Step 3: Run Prerender
```bash
npm run build
# Prerender script runs automatically during build
```

---

## Database Structure

The scripts fetch from the `cities` table which has:

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Unique city ID |
| name | VARCHAR | City name (Russian) |
| region_id | INTEGER | Foreign key to regions |
| timezone | VARCHAR | Timezone (e.g., "Europe/Moscow") |
| work_hours | VARCHAR | Working hours (e.g., "09:00 - 21:00") |
| address | TEXT | Physical address |
| is_active | BOOLEAN | Whether city is active |
| price_markup_percent | DECIMAL | Price markup % |

**API Endpoint:** Defined in `backend/func2url.json` under `"cities"`

---

## Slug Generation

The `generateSlug()` function uses Russian transliteration:

| Russian | Latin | Example |
|---------|-------|---------|
| Волгоград | volgograd | volgograd |
| Санкт-Петербург | sankt-peterburg | sankt-peterburg |
| Нижний Новгород | nizhnij-novgorod | nizhnij-novgorod |
| Ростов-на-Дону | rostov-na-donu | rostov-na-donu |

Special characters and spaces are converted to hyphens.

---

## Example Output

Running `node scripts/get-cities-with-slugs.js`:

```
============================================================
FETCHING ALL CITIES FROM DATABASE
============================================================

🔍 Fetching all cities from database...
📡 API URL: https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459

✅ Found 25 active cities in database

📋 CITIES WITH SLUGS:
============================================================
  1. Барнаул                      → barnaul
  2. Белокуриха                   → belokuriha
  3. Бийск                        → bijsk
  4. Волгоград                    → volgograd
  5. Екатеринбург                 → ekaterinburg
  ...
============================================================

💾 Saved to: scripts/cities-with-slugs.json
💾 JS format saved to: scripts/cities-with-slugs.js

✅ SUCCESS!
📊 Total cities: 25
```

---

## Troubleshooting

### Error: "HTTP error! status: 500"
**Solution:** Check that the database is accessible and the API endpoint in `backend/func2url.json` is correct.

### Empty cities list
**Solution:** Make sure you have active cities in the database (`is_active = true`).

### Missing slugs
**Solution:** The slug generator handles most Russian characters. If you have special cities with unusual names, you may need to manually adjust the slug in the output file.

---

## Related Files

- `backend/cities/index.py` - API endpoint implementation
- `backend/func2url.json` - API endpoint URLs
- `scripts/prerender.js` - Prerendering script
- `db_migrations/V0001__create_cities_table.sql` - Database schema

---

## Notes

- All scripts fetch **only active cities** (where `is_active = true`)
- Cities are automatically sorted alphabetically in the output
- The API groups cities by region, but the scripts flatten them into a single list
- Generated slugs are lowercase and use hyphens for separators

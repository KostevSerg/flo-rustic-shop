import json
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate dynamic XML sitemap with all cities and products
    Args: event with httpMethod
    Returns: XML sitemap response
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        import urllib.request
        
        cities_response = urllib.request.urlopen('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=list')
        cities_data = json.loads(cities_response.read().decode('utf-8'))
        
        products_response = urllib.request.urlopen('https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?action=list')
        products_data = json.loads(products_response.read().decode('utf-8'))
        
        # Уведомление поисковиков через IndexNow
        def notify_search_engines():
            try:
                indexnow_payload = json.dumps({'urls': ['/sitemap.xml']}).encode('utf-8')
                indexnow_req = urllib.request.Request(
                    'https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370',
                    data=indexnow_payload,
                    headers={'Content-Type': 'application/json'}
                )
                urllib.request.urlopen(indexnow_req, timeout=5)
            except:
                pass  # Не блокируем основной ответ если уведомление не удалось
        
        # Запускаем уведомление в фоне
        notify_search_engines()
        
        def create_slug(name: str) -> str:
            return (name.lower()
                    .replace('ё', 'e')
                    .replace(' ', '-')
                    .replace('а', 'a').replace('б', 'b').replace('в', 'v').replace('г', 'g')
                    .replace('д', 'd').replace('е', 'e').replace('ж', 'zh').replace('з', 'z')
                    .replace('и', 'i').replace('й', 'j').replace('к', 'k').replace('л', 'l')
                    .replace('м', 'm').replace('н', 'n').replace('о', 'o').replace('п', 'p')
                    .replace('р', 'r').replace('с', 's').replace('т', 't').replace('у', 'u')
                    .replace('ф', 'f').replace('х', 'h').replace('ц', 'c').replace('ч', 'ch')
                    .replace('ш', 'sh').replace('щ', 'sch').replace('ъ', '').replace('ы', 'y')
                    .replace('ь', '').replace('э', 'e').replace('ю', 'yu').replace('я', 'ya'))
        
        today = datetime.now().strftime('%Y-%m-%d')
        
        xml_urls = []
        
        xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>''')
        
        xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/catalog</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>''')
        
        xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/about</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>''')
        
        xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/delivery</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>''')
        
        xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/guarantees</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>''')
        
        xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/contacts</loc>
    <lastmod>{today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>''')
        
        xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/reviews</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>''')
        
        if cities_data.get('cities'):
            for region_cities in cities_data['cities'].values():
                for city in region_cities:
                    city_slug = create_slug(city['name'])
                    xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/city/{city_slug}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>''')
        
        if products_data.get('products'):
            for product in products_data['products']:
                xml_urls.append(f'''  <url>
    <loc>https://florustic.ru/product/{product["id"]}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>''')
        
        sitemap_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
{chr(10).join(xml_urls)}
  
</urlset>'''
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'body': sitemap_xml,
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f'Ошибка генерации sitemap: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Failed to generate sitemap: {str(e)}'}),
            'isBase64Encoded': False
        }
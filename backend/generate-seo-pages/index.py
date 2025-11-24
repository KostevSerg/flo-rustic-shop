'''
Business: Generate static HTML pages with unique meta tags for SEO
Args: event with httpMethod (GET/POST), context with request_id
Returns: JSON with generation status and file count
'''

import json
import os
import re
from typing import Dict, Any, List
import urllib.request
import urllib.error

# Окончания городов для предложного падежа
CITY_ENDINGS = {
    'Москва': 'Москве', 'Санкт-Петербург': 'Санкт-Петербурге',
    'Новосибирск': 'Новосибирске', 'Екатеринбург': 'Екатеринбурге',
    'Казань': 'Казани', 'Волгоград': 'Волгограде', 'Бийск': 'Бийске',
    'Барнаул': 'Барнауле', 'Воронеж': 'Воронеже', 'Красноярск': 'Красноярске',
    'Нижний Новгород': 'Нижнем Новгороде', 'Челябинск': 'Челябинске',
    'Самара': 'Самаре', 'Омск': 'Омске', 'Ростов-на-Дону': 'Ростове-на-Дону',
    'Уфа': 'Уфе', 'Пермь': 'Перми'
}

def create_slug(name: str) -> str:
    """Создает slug из названия города"""
    transliteration = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    }
    
    slug = name.lower().replace(' ', '-')
    result = ''
    for char in slug:
        result += transliteration.get(char, char)
    return result

def get_city_prepositional(city_name: str) -> str:
    """Возвращает название города в предложном падеже"""
    return CITY_ENDINGS.get(city_name, city_name + 'е')

def fetch_json(url: str) -> Dict[str, Any]:
    """Загружает JSON с URL"""
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        return json.loads(response.read().decode('utf-8'))

def update_meta_tags(html: str, title: str, description: str, url: str) -> str:
    """Обновляет meta-теги в HTML"""
    # Обновляем title
    html = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', html)
    
    # Обновляем description
    html = re.sub(
        r'<meta name="description" content="[^"]*"',
        f'<meta name="description" content="{description}"',
        html
    )
    
    # Обновляем или добавляем canonical
    if '<link rel="canonical"' in html:
        html = re.sub(
            r'<link rel="canonical" href="[^"]*"',
            f'<link rel="canonical" href="{url}"',
            html
        )
    else:
        html = html.replace('</head>', f'    <link rel="canonical" href="{url}" />\n</head>')
    
    return html

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        # Генерируем мета-теги для всех страниц
        base_html = '''<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8"/>
    <title>BASE_TITLE</title>
    <meta name="description" content="BASE_DESCRIPTION"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
<div id="root"></div>
</body>
</html>'''
        
        generated_pages = []
        
        # 1. Загружаем города
        cities_data = fetch_json('https://functions.poehali.dev/3f4d37f0-b84f-4157-83b7-55bdb568e459?action=list')
        cities_dict = cities_data.get('cities', {})
        
        # Преобразуем словарь регионов в плоский список городов
        cities = []
        for region_cities in cities_dict.values():
            if isinstance(region_cities, list):
                cities.extend(region_cities)
        
        # 2. Генерируем мета-теги для городов
        for city in cities:
            slug = create_slug(city['name'])
            city_name = city['name']
            city_prep = get_city_prepositional(city_name)
            
            title = f"Доставка цветов {city_name} — FloRustic | Купить розы, тюльпаны, пионы с доставкой в {city_prep}"
            description = f"Заказать свежие цветы с доставкой в {city_name} от FloRustic. Букеты роз, тюльпанов, пионов за 2 часа. Композиции ручной работы. Круглосуточный заказ онлайн в {city_prep}!"
            url = f"https://florustic.ru/city/{slug}"
            
            generated_pages.append({
                'type': 'city',
                'slug': slug,
                'title': title,
                'description': description,
                'url': url
            })
        
        # 3. Загружаем товары
        products_data = fetch_json('https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?action=list')
        products = products_data.get('products', [])
        
        # 4. Генерируем мета-теги для товаров
        for product in products:
            title = f"{product['name']} — купить с доставкой | FloRustic"
            price = product.get('base_price', product.get('price', 0))
            description = f"Служба доставки цветов FloRustic. {product['name']} — {price}₽. Свежие букеты с доставкой за 1.5 часа после оплаты. Заказ онлайн 24/7!"
            url = f"https://florustic.ru/product/{product['id']}"
            
            generated_pages.append({
                'type': 'product',
                'id': product['id'],
                'title': title,
                'description': description,
                'url': url
            })
        
        # 5. Статичные страницы
        static_pages = [
            {
                'type': 'static',
                'path': 'catalog',
                'title': 'Каталог букетов | FloRustic — Доставка цветов',
                'description': 'Служба доставки цветов FloRustic. Каталог: более 500 букетов. Розы, тюльпаны, пионы. Цены от 990₽!',
                'url': 'https://florustic.ru/catalog'
            },
            {
                'type': 'static',
                'path': 'delivery',
                'title': 'Доставка цветов по России | FloRustic',
                'description': 'Служба доставки цветов FloRustic по России. Доставка за 1.5 часа. Работаем 24/7 без выходных!',
                'url': 'https://florustic.ru/delivery'
            },
            {
                'type': 'static',
                'path': 'about',
                'title': 'О нас | FloRustic — Доставка цветов',
                'description': 'Служба доставки цветов FloRustic. Профессиональные флористы, свежие букеты, доставка за 2 часа.',
                'url': 'https://florustic.ru/about'
            },
            {
                'type': 'static',
                'path': 'contacts',
                'title': 'Контакты | FloRustic — Доставка цветов',
                'description': 'Контакты службы доставки цветов FloRustic. Работаем 24/7 по всей России.',
                'url': 'https://florustic.ru/contacts'
            },
            {
                'type': 'static',
                'path': 'reviews',
                'title': 'Отзывы клиентов | FloRustic — Доставка цветов',
                'description': 'Отзывы клиентов о доставке цветов FloRustic. Реальные отзывы о качестве букетов и сервисе.',
                'url': 'https://florustic.ru/reviews'
            }
        ]
        
        generated_pages.extend(static_pages)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'SEO meta tags generated successfully',
                'total_pages': len(generated_pages),
                'cities_count': len(cities),
                'products_count': len(products),
                'static_count': len(static_pages),
                'pages': generated_pages
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
    
    # GET - возвращаем статус
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'status': 'ready',
            'message': 'SEO pages generator is ready. Send POST request to generate.'
        }),
        'isBase64Encoded': False
    }
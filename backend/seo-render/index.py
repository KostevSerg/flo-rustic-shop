'''
Business: Dynamic SEO rendering - returns HTML with proper meta tags for bots
Args: event with path, headers, httpMethod; context with request_id  
Returns: HTML with SEO meta tags or redirect to main site
'''

import json
import os
import re
from typing import Dict, Any, Optional
import urllib.request
import urllib.error

# Определяем ботов по User-Agent
BOT_USER_AGENTS = [
    'googlebot', 'yandex', 'bingbot', 'slurp', 'duckduckbot',
    'baiduspider', 'facebookexternalhit', 'twitterbot', 'rogerbot',
    'linkedinbot', 'embedly', 'quora link preview', 'showyoubot',
    'outbrain', 'pinterest', 'slackbot', 'vkshare', 'w3c_validator',
    'whatsapp', 'telegrambot', 'viber', 'skype', 'instagram',
    'developers.google.com/+/web/snippet'
]

def is_bot(user_agent: str) -> bool:
    """Check if request is from a bot"""
    if not user_agent:
        return False
    ua_lower = user_agent.lower()
    return any(bot in ua_lower for bot in BOT_USER_AGENTS)

def create_slug(name: str) -> str:
    """Convert city name to URL slug"""
    transliteration = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-'
    }
    result = ''
    for char in name.lower():
        result += transliteration.get(char, char)
    return result

def get_city_prepositional(city: str) -> str:
    """Convert city name to prepositional case"""
    endings = {
        'Москва': 'Москве', 'Санкт-Петербург': 'Санкт-Петербурге',
        'Новосибирск': 'Новосибирске', 'Барнаул': 'Барнауле',
        'Бийск': 'Бийске', 'Мамонтово': 'Мамонтово'
    }
    return endings.get(city, city + 'е')

def fetch_cities() -> Dict[str, Any]:
    """Fetch cities from API"""
    url = 'https://functions.poehali.dev/f33ee89c-e17b-4d45-a1fb-52de0d0e4ec9'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=5) as response:
        return json.loads(response.read().decode('utf-8'))

def fetch_product(product_id: str) -> Optional[Dict[str, Any]]:
    """Fetch product from API"""
    url = f'https://functions.poehali.dev/f3ffc9b4-fbea-48e8-959d-c34ea68e6531?id={product_id}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode('utf-8'))
            products = data.get('products', [])
            return products[0] if products else None
    except Exception:
        return None

def generate_city_meta(city_name: str, region: str, city_slug: str) -> Dict[str, str]:
    """Generate meta tags for city page"""
    city_prep = get_city_prepositional(city_name)
    region_part = f', {region}' if region else ''
    
    title = f'Доставка цветов {city_name}{region_part} — FloRustic | Купить розы, тюльпаны, пионы с доставкой в {city_prep}'
    description = f'Заказать свежие цветы с доставкой в {city_name}{region_part} от FloRustic. Букеты роз, тюльпанов, пионов, хризантем за 2 часа. Композиции ручной работы. Круглосуточный заказ онлайн в {city_prep}!'
    url = f'https://florustic.ru/city/{city_slug}'
    
    return {
        'title': title,
        'description': description,
        'url': url,
        'og_title': title,
        'og_description': description
    }

def generate_product_meta(product: Dict[str, Any], product_id: str) -> Dict[str, str]:
    """Generate meta tags for product page"""
    name = product.get('name', 'Букет цветов')
    price = product.get('price', 0)
    description = product.get('description', '')[:80] if product.get('description') else 'Букеты ручной работы'
    
    title = f'{name} — купить в России | FloRustic'
    desc = f'Служба доставки цветов в России. {name} — {price}₽. Свежие цветы, доставка в течение 1.5 часов после оплаты. {description}. Заказ онлайн 24/7!'
    url = f'https://florustic.ru/product/{product_id}'
    
    return {
        'title': title,
        'description': desc,
        'url': url,
        'og_title': title,
        'og_description': desc,
        'og_image': product.get('image_url', '')
    }

def generate_catalog_meta() -> Dict[str, str]:
    """Generate meta tags for catalog page"""
    return {
        'title': 'Каталог букетов | FloRustic — Доставка цветов',
        'description': 'Служба доставки цветов в России. Свежие цветы — доставка в течение 1.5 часов после оплаты. Каталог: более 500 букетов на любой случай. Розы, тюльпаны, пионы, композиции. Цены от 990₽!',
        'url': 'https://florustic.ru/catalog',
        'og_title': 'Каталог букетов | FloRustic',
        'og_description': 'Более 500 букетов на любой случай'
    }

def generate_default_meta() -> Dict[str, str]:
    """Generate default meta tags"""
    return {
        'title': 'Доставка цветов — FloRustic | Свежие букеты роз, тюльпанов, пионов с доставкой за 2 часа по всей России',
        'description': 'Служба доставки цветов FloRustic. Свежие букеты с доставкой за 1.5 часа после оплаты. Розы, тюльпаны, пионы, хризантемы, композиции ручной работы. Работаем 24/7 без выходных.',
        'url': 'https://florustic.ru/',
        'og_title': 'Доставка цветов — FloRustic',
        'og_description': 'Свежие букеты с доставкой по всей России'
    }

def get_base_html(meta: Dict[str, str]) -> str:
    """Generate HTML with meta tags"""
    og_image = f'    <meta property="og:image" content="{meta["og_image"]}" />\n' if meta.get('og_image') else ''
    
    return f'''<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8"/>
    <title>{meta['title']}</title>
    <meta name="description" content="{meta['description']}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <link rel="canonical" href="{meta['url']}" />
    
    <meta property="og:type" content="website" />
    <meta property="og:title" content="{meta['og_title']}" />
    <meta property="og:description" content="{meta['og_description']}" />
    <meta property="og:url" content="{meta['url']}" />
    <meta property="og:site_name" content="FloRustic" />
{og_image}    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{meta['og_title']}" />
    <meta name="twitter:description" content="{meta['og_description']}" />
    
    <link rel="icon" type="image/png" href="https://cdn.poehali.dev/files/a67d7855-c81c-456d-8393-2b2ec7bfd0bd.png">
</head>
<body>
    <div id="root"></div>
    <script>
        // Redirect to main site for actual browsing
        if (!document.referrer || document.referrer.indexOf('florustic.ru') === -1) {{
            window.location.href = 'https://florustic.ru{meta.get('path', '/')}';
        }}
    </script>
    <noscript>
        <h1>{meta['title']}</h1>
        <p>{meta['description']}</p>
        <a href="https://florustic.ru{meta.get('path', '/')}">Перейти на сайт</a>
    </noscript>
</body>
</html>'''

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    # Handle CORS
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, User-Agent',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Check if request is from a bot
    headers = event.get('headers', {})
    user_agent = headers.get('user-agent', headers.get('User-Agent', ''))
    
    # If not a bot, redirect to main site
    if not is_bot(user_agent):
        return {
            'statusCode': 302,
            'headers': {
                'Location': 'https://florustic.ru/',
                'Cache-Control': 'no-cache'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Parse path
    path = event.get('path', event.get('queryStringParameters', {}).get('path', '/'))
    
    # Generate meta tags based on path
    meta = generate_default_meta()
    meta['path'] = path
    
    # Product pages
    if path.startswith('/product/'):
        product_id = path.replace('/product/', '').split('/')[0].split('?')[0]
        try:
            product = fetch_product(product_id)
            if product:
                meta = generate_product_meta(product, product_id)
                meta['path'] = path
        except Exception as e:
            print(f'Failed to fetch product: {e}')
    
    # Catalog page
    elif path.startswith('/catalog'):
        meta = generate_catalog_meta()
        meta['path'] = path
    
    # City pages
    elif path.startswith('/city/'):
        city_slug = path.replace('/city/', '').split('/')[0]
        
        # Fetch cities and find matching city
        try:
            cities_data = fetch_cities()
            for region in cities_data.get('cities', {}).values():
                for city in region:
                    if create_slug(city['name']) == city_slug:
                        meta = generate_city_meta(city['name'], city.get('region', ''), city_slug)
                        meta['path'] = path
                        break
        except Exception as e:
            print(f'Failed to fetch cities: {e}')
    
    # Generate HTML
    html = get_base_html(meta)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            'X-Robots-Tag': 'index, follow'
        },
        'isBase64Encoded': False,
        'body': html
    }
'''
Business: Генерация YML фида для Яндекс.Маркета
Args: event - dict с httpMethod, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: XML фид в формате YML
'''

import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from xml.sax.saxutils import escape


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    try:
        conn = psycopg2.connect(dsn)
        
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Получаем все активные товары с базовой ценой
            cur.execute('''
                SELECT 
                    id,
                    name,
                    description,
                    base_price as price,
                    image_url,
                    category,
                    composition
                FROM products
                WHERE is_active = true AND base_price > 0
                ORDER BY id
            ''')
            products = cur.fetchall()
            
            # Получаем уникальные категории
            cur.execute('''
                SELECT DISTINCT category 
                FROM products 
                WHERE is_active = true AND category IS NOT NULL AND category != ''
                ORDER BY category
            ''')
            categories = cur.fetchall()
        
        conn.close()
        
        # Генерируем YML фид
        yml_content = generate_yml_feed(products, categories)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/xml; charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'public, max-age=3600'
            },
            'isBase64Encoded': False,
            'body': yml_content
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Failed to generate feed: {str(e)}'})
        }


def generate_yml_feed(products: list, categories: list) -> str:
    now = datetime.utcnow().strftime('%Y-%m-%d %H:%M')
    
    yml = f'''<?xml version="1.0" encoding="UTF-8"?>
<yml_catalog date="{now}">
  <shop>
    <name>FloRustic</name>
    <company>FloRustic</company>
    <url>https://florustic.ru</url>
    <currencies>
      <currency id="RUB" rate="1"/>
    </currencies>
    <categories>
'''
    
    # Добавляем категории
    category_map = {}
    for idx, cat in enumerate(categories, start=1):
        cat_name = cat['category']
        category_map[cat_name] = idx
        yml += f'      <category id="{idx}">{escape(cat_name)}</category>\n'
    
    yml += '''    </categories>
    <offers>
'''
    
    # Добавляем товары
    for product in products:
        product_id = product['id']
        name = escape(product['name'] or '')
        description = escape(product['description'] or '')
        price = product['price']
        image_url = product['image_url'] or ''
        category = product['category'] or 'Букеты'
        composition = escape(product['composition'] or '')
        
        category_id = category_map.get(category, 1)
        
        # Формируем полное описание
        full_description = description
        if composition:
            full_description += f'. Состав: {composition}'
        
        yml += f'''      <offer id="{product_id}" available="true">
        <name>{name}</name>
        <url>https://florustic.ru/product/{product_id}</url>
        <price>{price}</price>
        <currencyId>RUB</currencyId>
        <categoryId>{category_id}</categoryId>
'''
        
        if image_url:
            yml += f'        <picture>{escape(image_url)}</picture>\n'
        
        yml += f'''        <description>{full_description}</description>
        <sales_notes>Доставка по России</sales_notes>
        <delivery>true</delivery>
        <pickup>false</pickup>
        <vendor>FloRustic</vendor>
        <country_of_origin>Россия</country_of_origin>
      </offer>
'''
    
    yml += '''    </offers>
  </shop>
</yml_catalog>'''
    
    return yml
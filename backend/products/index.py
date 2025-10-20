import json
import os
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage products (get, create, update, delete) and city-specific prices
    Args: event with httpMethod, body, queryStringParameters, pathParams
          context with request_id attribute
    Returns: HTTP response with products data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    conn = psycopg2.connect(database_url)
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            action = query_params.get('action')
            city_name = query_params.get('city')
            category = query_params.get('category')
            subcategory_id = query_params.get('subcategory_id')
            
            if action == 'subcategories':
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    if category:
                        cur.execute('''
                            SELECT id, name, category, is_active
                            FROM subcategories
                            WHERE category = %s AND is_active = true
                            ORDER BY name
                        ''', (category,))
                    else:
                        cur.execute('''
                            SELECT id, name, category, is_active
                            FROM subcategories
                            WHERE is_active = true
                            ORDER BY category, name
                        ''')
                    
                    subcategories = [dict(row) for row in cur.fetchall()]
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'subcategories': subcategories}, ensure_ascii=False)
                    }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if city_name:
                    if subcategory_id:
                        cur.execute('''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name,
                                   COALESCE(pcp.price, p.base_price) as price
                            FROM products p
                            LEFT JOIN cities c ON c.name = %s AND c.is_active = true
                            LEFT JOIN product_city_prices pcp ON pcp.product_id = p.id AND pcp.city_id = c.id
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true AND p.subcategory_id = %s
                            ORDER BY p.created_at DESC
                        ''', (city_name, subcategory_id))
                    elif category:
                        cur.execute('''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name,
                                   COALESCE(pcp.price, p.base_price) as price
                            FROM products p
                            LEFT JOIN cities c ON c.name = %s AND c.is_active = true
                            LEFT JOIN product_city_prices pcp ON pcp.product_id = p.id AND pcp.city_id = c.id
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true AND p.category = %s
                            ORDER BY p.created_at DESC
                        ''', (city_name, category))
                    else:
                        cur.execute('''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name,
                                   COALESCE(pcp.price, p.base_price) as price
                            FROM products p
                            LEFT JOIN cities c ON c.name = %s AND c.is_active = true
                            LEFT JOIN product_city_prices pcp ON pcp.product_id = p.id AND pcp.city_id = c.id
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true
                            ORDER BY p.created_at DESC
                        ''', (city_name,))
                else:
                    if subcategory_id:
                        cur.execute('''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.base_price, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name
                            FROM products p
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true AND p.subcategory_id = %s
                            ORDER BY p.created_at DESC
                        ''', (subcategory_id,))
                    elif category:
                        cur.execute('''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.base_price, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name
                            FROM products p
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true AND p.category = %s
                            ORDER BY p.created_at DESC
                        ''', (category,))
                    else:
                        cur.execute('''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.base_price, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name
                            FROM products p
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true
                            ORDER BY p.created_at DESC
                        ''')
                
                products = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'products': products}, ensure_ascii=False)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action', 'create')
            
            if action == 'create':
                name = body_data.get('name', '').strip()
                description = body_data.get('description', '').strip()
                composition = body_data.get('composition', '').strip()
                image_url = body_data.get('image_url', '').strip()
                base_price = body_data.get('base_price')
                category = body_data.get('category', '').strip()
                subcategory_id = body_data.get('subcategory_id')
                
                if not name or not base_price:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Name and base_price are required'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        '''INSERT INTO products (name, description, composition, image_url, base_price, category, subcategory_id)
                           VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id, name, description, composition, image_url, base_price, category, subcategory_id''',
                        (name, description, composition, image_url, base_price, category, subcategory_id)
                    )
                    new_product = dict(cur.fetchone())
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'product': new_product}, ensure_ascii=False)
                    }
            
            elif action == 'set_city_price':
                product_id = body_data.get('product_id')
                city_id = body_data.get('city_id')
                price = body_data.get('price')
                
                if not product_id or not city_id or not price:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'product_id, city_id, and price are required'})
                    }
                
                with conn.cursor() as cur:
                    cur.execute(
                        '''INSERT INTO product_city_prices (product_id, city_id, price)
                           VALUES (%s, %s, %s)
                           ON CONFLICT (product_id, city_id) 
                           DO UPDATE SET price = EXCLUDED.price, updated_at = CURRENT_TIMESTAMP''',
                        (product_id, city_id, price)
                    )
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True})
                    }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            product_id = body_data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Product ID is required'})
                }
            
            update_fields = []
            params = []
            
            if 'name' in body_data:
                update_fields.append('name = %s')
                params.append(body_data['name'])
            if 'description' in body_data:
                update_fields.append('description = %s')
                params.append(body_data['description'])
            if 'composition' in body_data:
                update_fields.append('composition = %s')
                params.append(body_data['composition'])
            if 'image_url' in body_data:
                update_fields.append('image_url = %s')
                params.append(body_data['image_url'])
            if 'base_price' in body_data:
                update_fields.append('base_price = %s')
                params.append(body_data['base_price'])
            if 'category' in body_data:
                update_fields.append('category = %s')
                params.append(body_data['category'])
            if 'subcategory_id' in body_data:
                update_fields.append('subcategory_id = %s')
                params.append(body_data['subcategory_id'])
            if 'is_featured' in body_data:
                update_fields.append('is_featured = %s')
                params.append(body_data['is_featured'])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            params.append(product_id)
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    f'''UPDATE products SET {', '.join(update_fields)}, updated_at = CURRENT_TIMESTAMP
                        WHERE id = %s RETURNING id, name, description, composition, image_url, base_price, category, subcategory_id, is_featured''',
                    params
                )
                updated_product = dict(cur.fetchone())
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'product': updated_product}, ensure_ascii=False)
                }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            product_id = body_data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Product ID is required'})
                }
            
            with conn.cursor() as cur:
                cur.execute('UPDATE products SET is_active = false WHERE id = %s', (product_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True})
                }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()
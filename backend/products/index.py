import json
import os
from typing import Dict, Any, List, Optional
from decimal import Decimal
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
    
    conn = None
    try:
        conn = psycopg2.connect(database_url, connect_timeout=5)
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            action = query_params.get('action')
            product_id = query_params.get('id')
            city_name = query_params.get('city')
            category = query_params.get('category')
            subcategory_id = query_params.get('subcategory_id')
            with_relations = query_params.get('with_relations') == 'true'
            
            if action == 'subcategories':
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    if category:
                        safe_category = category.replace("'", "''")
                        cur.execute(f'''
                            SELECT id, name, category, is_active
                            FROM subcategories
                            WHERE category = '{safe_category}' AND is_active = true
                            ORDER BY name
                        ''')
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
                if product_id:
                    if city_name:
                        safe_city_name = city_name.replace("'", "''")
                        cur.execute(f'''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name,
                                   COALESCE(pcp.price, 
                                           ROUND(p.base_price * (1 + COALESCE(c.price_markup_percent, 0) / 100), 2)
                                   ) as price
                            FROM products p
                            LEFT JOIN cities c ON c.name = '{safe_city_name}' AND c.is_active = true
                            LEFT JOIN product_city_prices pcp ON pcp.product_id = p.id AND pcp.city_id = c.id
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true AND p.id = {int(product_id)}
                        ''')
                    else:
                        cur.execute(f'''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.base_price, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name
                            FROM products p
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true AND p.id = {int(product_id)}
                        ''')
                    
                    products = [dict(row) for row in cur.fetchall()]
                    
                    def decimal_default(obj):
                        if isinstance(obj, Decimal):
                            return float(obj)
                        raise TypeError
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'products': products}, default=decimal_default, ensure_ascii=False)
                    }
                
                elif city_name:
                    safe_city_name = city_name.replace("'", "''")
                    if subcategory_id:
                        cur.execute(f'''
                            SELECT DISTINCT p.id, p.name, p.description, p.composition, p.image_url, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name, p.created_at,
                                   COALESCE(pcp.price, 
                                           ROUND(p.base_price * (1 + COALESCE(c.price_markup_percent, 0) / 100), 2)
                                   ) as price
                            FROM products p
                            LEFT JOIN cities c ON c.name = '{safe_city_name}' AND c.is_active = true
                            LEFT JOIN product_city_prices pcp ON pcp.product_id = p.id AND pcp.city_id = c.id
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            JOIN product_subcategories ps ON ps.product_id = p.id
                            WHERE p.is_active = true AND ps.subcategory_id = {int(subcategory_id)}
                            ORDER BY p.created_at DESC
                            LIMIT 100
                        ''')
                    elif category:
                        safe_category = category.replace("'", "''")
                        cur.execute(f'''
                            SELECT DISTINCT p.id, p.name, p.description, p.composition, p.image_url, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name, p.created_at,
                                   COALESCE(pcp.price, 
                                           ROUND(p.base_price * (1 + COALESCE(c.price_markup_percent, 0) / 100), 2)
                                   ) as price
                            FROM products p
                            LEFT JOIN cities c ON c.name = '{safe_city_name}' AND c.is_active = true
                            LEFT JOIN product_city_prices pcp ON pcp.product_id = p.id AND pcp.city_id = c.id
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            JOIN product_categories pc ON pc.product_id = p.id
                            WHERE p.is_active = true AND pc.category = '{safe_category}'
                            ORDER BY p.created_at DESC
                            LIMIT 100
                        ''')
                    else:
                        cur.execute(f'''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name,
                                   COALESCE(pcp.price, 
                                           ROUND(p.base_price * (1 + COALESCE(c.price_markup_percent, 0) / 100), 2)
                                   ) as price
                            FROM products p
                            LEFT JOIN cities c ON c.name = '{safe_city_name}' AND c.is_active = true
                            LEFT JOIN product_city_prices pcp ON pcp.product_id = p.id AND pcp.city_id = c.id
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true
                            ORDER BY p.created_at DESC
                            LIMIT 100
                        ''')
                else:
                    if subcategory_id:
                        cur.execute(f'''
                            SELECT DISTINCT p.id, p.name, p.description, p.composition, p.image_url, p.base_price, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name, p.created_at
                            FROM products p
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            JOIN product_subcategories ps ON ps.product_id = p.id
                            WHERE p.is_active = true AND ps.subcategory_id = {int(subcategory_id)}
                            ORDER BY p.created_at DESC
                            LIMIT 100
                        ''')
                    elif category:
                        safe_category = category.replace("'", "''")
                        cur.execute(f'''
                            SELECT DISTINCT p.id, p.name, p.description, p.composition, p.image_url, p.base_price, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name, p.created_at
                            FROM products p
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            JOIN product_categories pc ON pc.product_id = p.id
                            WHERE p.is_active = true AND pc.category = '{safe_category}'
                            ORDER BY p.created_at DESC
                            LIMIT 100
                        ''')
                    else:
                        cur.execute('''
                            SELECT p.id, p.name, p.description, p.composition, p.image_url, p.base_price, p.category, p.is_featured, p.subcategory_id,
                                   s.name as subcategory_name
                            FROM products p
                            LEFT JOIN subcategories s ON s.id = p.subcategory_id
                            WHERE p.is_active = true
                            ORDER BY p.created_at DESC
                            LIMIT 100
                        ''')
                
                products = [dict(row) for row in cur.fetchall()]
                
                # Очищаем base64 изображения (слишком большие для ответа)
                for product in products:
                    if product.get('image_url') and len(product['image_url']) > 5000:
                        product['image_url'] = ''
                
                # Добавляем categories/subcategories если запрошено или для конкретного товара
                if (with_relations or product_id) and products:
                    product_ids = [p['id'] for p in products]
                    product_ids_str = ','.join(map(str, product_ids))
                    
                    # Получаем все категории одним запросом
                    cur.execute(f'''
                        SELECT product_id, category 
                        FROM product_categories 
                        WHERE product_id IN ({product_ids_str})
                    ''')
                    categories_map = {}
                    for row in cur.fetchall():
                        pid = row['product_id']
                        if pid not in categories_map:
                            categories_map[pid] = []
                        categories_map[pid].append(row['category'])
                    
                    # Получаем все подкатегории одним запросом
                    cur.execute(f'''
                        SELECT ps.product_id, ps.subcategory_id, s.name, s.category 
                        FROM product_subcategories ps
                        JOIN subcategories s ON s.id = ps.subcategory_id
                        WHERE ps.product_id IN ({product_ids_str})
                    ''')
                    subcategories_map = {}
                    for row in cur.fetchall():
                        pid = row['product_id']
                        if pid not in subcategories_map:
                            subcategories_map[pid] = []
                        subcategories_map[pid].append({
                            'subcategory_id': row['subcategory_id'],
                            'name': row['name'],
                            'category': row['category']
                        })
                    
                    # Добавляем к товарам
                    for product in products:
                        product['categories'] = categories_map.get(product['id'], [])
                        product['subcategories'] = subcategories_map.get(product['id'], [])
                
                def decimal_default(obj):
                    if isinstance(obj, Decimal):
                        return float(obj)
                    if hasattr(obj, 'isoformat'):
                        return obj.isoformat()
                    raise TypeError
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'products': products}, ensure_ascii=False, default=decimal_default)
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
                categories = body_data.get('categories', [])
                subcategory_id = body_data.get('subcategory_id')
                subcategory_ids = body_data.get('subcategory_ids', [])
                
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
                
                safe_name = name.replace("'", "''")
                safe_desc = description.replace("'", "''")
                safe_comp = composition.replace("'", "''")
                safe_img = image_url.replace("'", "''")
                safe_cat = category.replace("'", "''")
                
                with conn.cursor() as cur:
                    if subcategory_id:
                        cur.execute(f'''
                            INSERT INTO products (name, description, composition, image_url, base_price, category, subcategory_id)
                            VALUES ('{safe_name}', '{safe_desc}', '{safe_comp}', '{safe_img}', {float(base_price)}, '{safe_cat}', {int(subcategory_id)})
                            RETURNING id
                        ''')
                    else:
                        cur.execute(f'''
                            INSERT INTO products (name, description, composition, image_url, base_price, category)
                            VALUES ('{safe_name}', '{safe_desc}', '{safe_comp}', '{safe_img}', {float(base_price)}, '{safe_cat}')
                            RETURNING id
                        ''')
                    product_id = cur.fetchone()[0]
                    
                    # Добавляем множественные категории
                    if categories:
                        for cat in categories:
                            safe_category = cat.replace("'", "''")
                            cur.execute(f'''
                                INSERT INTO product_categories (product_id, category)
                                VALUES ({product_id}, '{safe_category}')
                                ON CONFLICT (product_id, category) DO NOTHING
                            ''')
                    elif category:
                        cur.execute(f'''
                            INSERT INTO product_categories (product_id, category)
                            VALUES ({product_id}, '{safe_cat}')
                            ON CONFLICT (product_id, category) DO NOTHING
                        ''')
                    
                    # Добавляем множественные подкатегории
                    if subcategory_ids:
                        for sub_id in subcategory_ids:
                            cur.execute(f'''
                                INSERT INTO product_subcategories (product_id, subcategory_id)
                                VALUES ({product_id}, {int(sub_id)})
                                ON CONFLICT (product_id, subcategory_id) DO NOTHING
                            ''')
                    elif subcategory_id:
                        cur.execute(f'''
                            INSERT INTO product_subcategories (product_id, subcategory_id)
                            VALUES ({product_id}, {int(subcategory_id)})
                            ON CONFLICT (product_id, subcategory_id) DO NOTHING
                        ''')
                    
                    conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'id': product_id, 'message': 'Product created successfully'})
                }
            
            elif action == 'city_price':
                product_id = body_data.get('product_id')
                city_name = body_data.get('city_name', '').strip()
                price = body_data.get('price')
                
                if not product_id or not city_name or not price:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'product_id, city_name, and price are required'})
                    }
                
                safe_city_name = city_name.replace("'", "''")
                
                with conn.cursor() as cur:
                    cur.execute(f'''
                        SELECT id FROM cities WHERE name = '{safe_city_name}' AND is_active = true
                    ''')
                    city_row = cur.fetchone()
                    
                    if not city_row:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({'error': 'City not found or inactive'})
                        }
                    
                    city_id = city_row[0]
                    
                    cur.execute(f'''
                        INSERT INTO product_city_prices (product_id, city_id, price)
                        VALUES ({int(product_id)}, {int(city_id)}, {float(price)})
                        ON CONFLICT (product_id, city_id) 
                        DO UPDATE SET price = {float(price)}
                    ''')
                    conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'message': 'City-specific price updated successfully'})
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
            
            updates = []
            if 'name' in body_data:
                safe_name = body_data['name'].replace("'", "''")
                updates.append(f"name = '{safe_name}'")
            if 'description' in body_data:
                safe_desc = body_data['description'].replace("'", "''")
                updates.append(f"description = '{safe_desc}'")
            if 'composition' in body_data:
                safe_comp = body_data['composition'].replace("'", "''")
                updates.append(f"composition = '{safe_comp}'")
            if 'image_url' in body_data:
                safe_img = body_data['image_url'].replace("'", "''")
                updates.append(f"image_url = '{safe_img}'")
            if 'base_price' in body_data:
                updates.append(f"base_price = {float(body_data['base_price'])}")
            if 'category' in body_data:
                safe_cat = body_data['category'].replace("'", "''")
                updates.append(f"category = '{safe_cat}'")
            if 'subcategory_id' in body_data:
                if body_data['subcategory_id'] is None:
                    updates.append("subcategory_id = NULL")
                else:
                    updates.append(f"subcategory_id = {int(body_data['subcategory_id'])}")
            if 'is_featured' in body_data:
                updates.append(f"is_featured = {bool(body_data['is_featured'])}")
            if 'is_active' in body_data:
                updates.append(f"is_active = {bool(body_data['is_active'])}")
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            with conn.cursor() as cur:
                if updates:
                    update_query = f"UPDATE products SET {', '.join(updates)} WHERE id = {int(product_id)}"
                    cur.execute(update_query)
                
                # Обновляем категории если переданы
                if 'categories' in body_data:
                    # Удаляем старые
                    cur.execute(f"DELETE FROM product_categories WHERE product_id = {int(product_id)}")
                    # Добавляем новые
                    for cat in body_data['categories']:
                        safe_cat = cat.replace("'", "''")
                        cur.execute(f'''
                            INSERT INTO product_categories (product_id, category)
                            VALUES ({int(product_id)}, '{safe_cat}')
                        ''')
                
                # Обновляем подкатегории если переданы
                if 'subcategory_ids' in body_data:
                    # Удаляем старые
                    cur.execute(f"DELETE FROM product_subcategories WHERE product_id = {int(product_id)}")
                    # Добавляем новые
                    for sub_id in body_data['subcategory_ids']:
                        cur.execute(f'''
                            INSERT INTO product_subcategories (product_id, subcategory_id)
                            VALUES ({int(product_id)}, {int(sub_id)})
                        ''')
                
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Product updated successfully'})
            }
        
        elif method == 'DELETE':
            path_params = event.get('pathParams') or {}
            product_id = path_params.get('id')
            
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
                cur.execute(f"UPDATE products SET is_active = false WHERE id = {int(product_id)}")
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'message': 'Product deleted successfully'})
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
        if conn:
            conn.close()
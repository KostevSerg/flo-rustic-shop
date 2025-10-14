import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage cities, city contacts, reviews, and settlements
    Args: event with httpMethod, body, queryStringParameters (action: contacts/reviews/settlements)
          context with request_id attribute
    Returns: HTTP response with cities, contacts, reviews, or settlements data
    '''
    method: str = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action')
    
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
            if action == 'settlements':
                city_id = params.get('city_id')
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    if city_id:
                        cur.execute('''
                            SELECT id, city_id, name, delivery_price, is_active
                            FROM settlements
                            WHERE city_id = %s AND is_active = TRUE
                            ORDER BY name
                        ''', (city_id,))
                    else:
                        cur.execute('''
                            SELECT s.id, s.city_id, c.name as city_name, s.name, s.delivery_price, s.is_active
                            FROM settlements s
                            JOIN cities c ON c.id = s.city_id
                            WHERE s.is_active = TRUE
                            ORDER BY c.name, s.name
                        ''')
                    rows = cur.fetchall()
                    settlements = [dict(row) for row in rows]
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'settlements': settlements}, ensure_ascii=False, default=str)
                    }
            elif action == 'reviews':
                show_all = params.get('all') == 'true'
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    if show_all:
                        cur.execute('''
                            SELECT id, name, city, email, phone, rating, comment, is_approved, created_at 
                            FROM reviews 
                            ORDER BY created_at DESC
                        ''')
                    else:
                        cur.execute('''
                            SELECT id, name, city, rating, comment, created_at 
                            FROM reviews 
                            WHERE is_approved = TRUE 
                            ORDER BY created_at DESC
                        ''')
                    rows = cur.fetchall()
                    reviews = [dict(row) for row in rows]
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'reviews': reviews}, ensure_ascii=False, default=str)
                    }
            elif action == 'contacts':
                city_name = params.get('city')
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    if city_name:
                        cur.execute('''
                            SELECT cc.id, cc.city_id, c.name as city_name, cc.phone, 
                                   cc.email, cc.address, cc.working_hours, cc.delivery_info
                            FROM city_contacts cc
                            JOIN cities c ON c.id = cc.city_id
                            WHERE c.name = %s
                        ''', (city_name,))
                        row = cur.fetchone()
                        
                        if row:
                            return {
                                'statusCode': 200,
                                'headers': {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                },
                                'isBase64Encoded': False,
                                'body': json.dumps({'contact': dict(row)}, ensure_ascii=False)
                            }
                        else:
                            return {
                                'statusCode': 404,
                                'headers': {
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': '*'
                                },
                                'isBase64Encoded': False,
                                'body': json.dumps({'error': 'Contact not found'})
                            }
                    else:
                        cur.execute('''
                            SELECT cc.id, cc.city_id, c.name as city_name, cc.phone, 
                                   cc.email, cc.address, cc.working_hours, cc.delivery_info
                            FROM city_contacts cc
                            JOIN cities c ON c.id = cc.city_id
                            ORDER BY c.name
                        ''')
                        rows = cur.fetchall()
                        contacts = [dict(row) for row in rows]
                        
                        return {
                            'statusCode': 200,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({'contacts': contacts}, ensure_ascii=False)
                        }
            else:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute('SELECT id, name, region, is_active FROM cities WHERE is_active = true ORDER BY region, name')
                    cities = cur.fetchall()
                    
                    grouped_cities: Dict[str, List[Dict[str, Any]]] = {}
                    for city in cities:
                        region = city['region']
                        if region not in grouped_cities:
                            grouped_cities[region] = []
                        grouped_cities[region].append({
                            'id': city['id'],
                            'name': city['name'],
                            'region': city['region']
                        })
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'cities': grouped_cities}, ensure_ascii=False)
                    }
        
        elif method == 'POST':
            if action == 'settlements':
                body_data = json.loads(event.get('body', '{}'))
                city_id = body_data.get('city_id')
                name = body_data.get('name', '').strip()
                delivery_price = body_data.get('delivery_price', 0)
                
                if not city_id or not name:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'City ID and name are required'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute('''
                        INSERT INTO settlements (city_id, name, delivery_price)
                        VALUES (%s, %s, %s)
                        RETURNING id, city_id, name, delivery_price
                    ''', (city_id, name, delivery_price))
                    
                    result = cur.fetchone()
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'settlement': dict(result)}, ensure_ascii=False)
                    }
            elif action == 'reviews':
                body_data = json.loads(event.get('body', '{}'))
                name = body_data.get('name', '').strip()
                city = body_data.get('city', '').strip()
                email = body_data.get('email', '').strip() or None
                phone = body_data.get('phone', '').strip() or None
                rating = body_data.get('rating')
                comment = body_data.get('comment', '').strip()
                
                if not name or not city or not rating or not comment:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Name, city, rating and comment are required'})
                    }
                
                if not isinstance(rating, int) or rating < 1 or rating > 5:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Rating must be between 1 and 5'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute('''
                        INSERT INTO reviews (name, city, email, phone, rating, comment, is_approved)
                        VALUES (%s, %s, %s, %s, %s, %s, FALSE)
                        RETURNING id
                    ''', (name, city, email, phone, rating, comment))
                    
                    result = cur.fetchone()
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Review submitted for approval', 'id': result['id']})
                    }
            else:
                body_data = json.loads(event.get('body', '{}'))
                name = body_data.get('name', '').strip()
                region = body_data.get('region', '').strip()
                
                if not name or not region:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Name and region are required'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        'INSERT INTO cities (name, region) VALUES (%s, %s) RETURNING id, name, region',
                        (name, region)
                    )
                    new_city = cur.fetchone()
                    city_id = new_city['id']
                    
                    cur.execute('''
                        INSERT INTO city_contacts (city_id, phone, email, address, working_hours, delivery_info)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    ''', (
                        city_id,
                        '+7 (999) 123-45-67',
                        'info@florustic.ru',
                        f'г. {name}, ул. Цветочная, 15',
                        'Круглосуточно',
                        'Бесплатная доставка в пределах центра'
                    ))
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'city': dict(new_city)}, ensure_ascii=False)
                    }
        
        elif method == 'PUT':
            if action == 'settlements':
                body_data = json.loads(event.get('body', '{}'))
                settlement_id = body_data.get('id')
                name = body_data.get('name')
                delivery_price = body_data.get('delivery_price')
                
                if not settlement_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Settlement ID is required'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute('''
                        UPDATE settlements 
                        SET name = COALESCE(%s, name),
                            delivery_price = COALESCE(%s, delivery_price),
                            updated_at = CURRENT_TIMESTAMP
                        WHERE id = %s
                        RETURNING id, city_id, name, delivery_price
                    ''', (name, delivery_price, settlement_id))
                    
                    updated = cur.fetchone()
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'settlement': dict(updated)}, ensure_ascii=False)
                    }
            elif action == 'reviews':
                body_data = json.loads(event.get('body', '{}'))
                review_id = body_data.get('id')
                is_approved = body_data.get('is_approved')
                
                if not review_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Review ID is required'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute('''
                        UPDATE reviews 
                        SET is_approved = %s 
                        WHERE id = %s
                    ''', (is_approved, review_id))
                    
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Review updated successfully'})
                    }
            elif action == 'contacts':
                body_data = json.loads(event.get('body', '{}'))
                city_id = body_data.get('city_id')
                phone = body_data.get('phone')
                email = body_data.get('email')
                address = body_data.get('address')
                working_hours = body_data.get('working_hours')
                delivery_info = body_data.get('delivery_info')
                
                if not city_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Missing city_id'})
                    }
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute('''
                        INSERT INTO city_contacts 
                            (city_id, phone, email, address, working_hours, delivery_info, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                        ON CONFLICT (city_id) 
                        DO UPDATE SET 
                            phone = EXCLUDED.phone,
                            email = EXCLUDED.email,
                            address = EXCLUDED.address,
                            working_hours = EXCLUDED.working_hours,
                            delivery_info = EXCLUDED.delivery_info,
                            updated_at = CURRENT_TIMESTAMP
                        RETURNING id, city_id
                    ''', (city_id, phone, email, address, working_hours, delivery_info))
                    
                    updated = cur.fetchone()
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'success': True, 'contact': dict(updated)}, ensure_ascii=False)
                    }
            
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid action'})
            }
        
        elif method == 'DELETE':
            if action == 'settlements':
                settlement_id = params.get('id')
                
                if not settlement_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Settlement ID is required'})
                    }
                
                with conn.cursor() as cur:
                    cur.execute('UPDATE settlements SET is_active = FALSE WHERE id = %s', (settlement_id,))
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Settlement deactivated successfully'})
                    }
            elif action == 'reviews':
                review_id = params.get('id')
                
                if not review_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Review ID is required'})
                    }
                
                with conn.cursor() as cur:
                    cur.execute('DELETE FROM reviews WHERE id = %s', (review_id,))
                    conn.commit()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'message': 'Review deleted successfully'})
                    }
            else:
                body_data = json.loads(event.get('body', '{}'))
                city_id = body_data.get('id')
                
                if not city_id:
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'City ID is required'})
                    }
                
                with conn.cursor() as cur:
                    cur.execute('UPDATE cities SET is_active = false WHERE id = %s', (city_id,))
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
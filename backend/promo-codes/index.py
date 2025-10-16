import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage promo codes (create, list, delete, validate)
    Args: event with httpMethod, body, queryStringParameters
          context with request_id attribute
    Returns: HTTP response with promo codes data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
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
            code = query_params.get('code')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if code:
                    cur.execute('''
                        SELECT id, code, discount_percent, is_active
                        FROM promo_codes
                        WHERE code = %s AND is_active = true
                    ''', (code.upper(),))
                    promo = cur.fetchone()
                    
                    if not promo:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({'error': 'Промокод не найден или неактивен'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'promo': dict(promo)}, ensure_ascii=False)
                    }
                else:
                    cur.execute('''
                        SELECT id, code, discount_percent, is_active, created_at
                        FROM promo_codes
                        ORDER BY created_at DESC
                    ''')
                    promos = [dict(row) for row in cur.fetchall()]
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'promo_codes': promos}, ensure_ascii=False, default=str)
                    }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            code = body_data.get('code', '').strip().upper()
            discount_percent = body_data.get('discount_percent')
            
            if not code or not discount_percent:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Код и процент скидки обязательны'})
                }
            
            if discount_percent < 1 or discount_percent > 100:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Скидка должна быть от 1 до 100%'})
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                try:
                    cur.execute(
                        '''INSERT INTO promo_codes (code, discount_percent)
                           VALUES (%s, %s) RETURNING id, code, discount_percent, is_active''',
                        (code, discount_percent)
                    )
                    new_promo = dict(cur.fetchone())
                    conn.commit()
                    
                    return {
                        'statusCode': 201,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'promo': new_promo}, ensure_ascii=False)
                    }
                except psycopg2.IntegrityError:
                    conn.rollback()
                    return {
                        'statusCode': 400,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Промокод уже существует'})
                    }
        
        elif method == 'DELETE':
            body_data = json.loads(event.get('body', '{}'))
            promo_id = body_data.get('id')
            
            if not promo_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'ID промокода обязателен'})
                }
            
            with conn.cursor() as cur:
                cur.execute('UPDATE promo_codes SET is_active = false WHERE id = %s', (promo_id,))
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

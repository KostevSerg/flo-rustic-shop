import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage static page contents (get, update) for About, Delivery, Guarantees pages
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with page content data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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
            page_key = query_params.get('page_key')
            list_all = query_params.get('list') == 'true'
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if list_all:
                    cur.execute('''
                        SELECT id, page_key, title, content, meta_description, meta_keywords, updated_at
                        FROM t_p90017259_flo_rustic_shop.page_contents
                        ORDER BY page_key
                    ''')
                    pages = cur.fetchall()
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'pages': pages}, default=str)
                    }
                
                if page_key:
                    cur.execute('''
                        SELECT id, page_key, title, content, meta_description, meta_keywords, updated_at
                        FROM t_p90017259_flo_rustic_shop.page_contents
                        WHERE page_key = %s
                    ''', (page_key,))
                    page = cur.fetchone()
                    
                    if not page:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'isBase64Encoded': False,
                            'body': json.dumps({'error': 'Page not found'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps(dict(page), default=str)
                    }
                
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing page_key or list parameter'})
                }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            page_key = body_data.get('page_key')
            title = body_data.get('title')
            content = body_data.get('content')
            meta_description = body_data.get('meta_description', '')
            meta_keywords = body_data.get('meta_keywords', '')
            
            if not page_key or not title or content is None:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Missing required fields'})
                }
            
            with conn.cursor() as cur:
                cur.execute('''
                    UPDATE t_p90017259_flo_rustic_shop.page_contents
                    SET title = %s, content = %s, meta_description = %s, meta_keywords = %s, updated_at = NOW()
                    WHERE page_key = %s
                    RETURNING id
                ''', (title, content, meta_description, meta_keywords, page_key))
                
                result = cur.fetchone()
                if not result:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Page not found'})
                    }
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True, 'message': 'Page updated'})
                }
        
        else:
            return {
                'statusCode': 405,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        conn.rollback()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        conn.close()
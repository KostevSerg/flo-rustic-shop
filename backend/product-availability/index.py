"""
API для управления доступностью товаров в городах.
По умолчанию все товары доступны везде.
Эндпоинт управляет исключениями (где товар НЕДОСТУПЕН).
"""

import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'DATABASE_URL not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            return get_exclusions(conn, event)
        elif method == 'POST':
            return add_exclusion(conn, event)
        elif method == 'DELETE':
            return remove_exclusion(conn, event)
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    finally:
        conn.close()


def get_exclusions(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    """Получить список исключений (где товары недоступны)"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    city_id = params.get('city_id')
    
    cursor = conn.cursor()
    
    if product_id:
        query = f"""
            SELECT pce.id, pce.product_id, pce.city_id, c.name as city_name
            FROM t_p90017259_flo_rustic_shop.product_city_exclusions pce
            JOIN t_p90017259_flo_rustic_shop.cities c ON c.id = pce.city_id
            WHERE pce.product_id = {int(product_id)}
            ORDER BY c.name
        """
        cursor.execute(query)
    elif city_id:
        query = f"""
            SELECT pce.id, pce.product_id, pce.city_id, p.name as product_name
            FROM t_p90017259_flo_rustic_shop.product_city_exclusions pce
            JOIN t_p90017259_flo_rustic_shop.products p ON p.id = pce.product_id
            WHERE pce.city_id = {int(city_id)}
            ORDER BY p.name
        """
        cursor.execute(query)
    else:
        cursor.execute("""
            SELECT pce.id, pce.product_id, pce.city_id, 
                   p.name as product_name, c.name as city_name
            FROM t_p90017259_flo_rustic_shop.product_city_exclusions pce
            JOIN t_p90017259_flo_rustic_shop.products p ON p.id = pce.product_id
            JOIN t_p90017259_flo_rustic_shop.cities c ON c.id = pce.city_id
            ORDER BY p.name, c.name
        """)
    
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    
    exclusions = []
    for row in rows:
        exclusions.append(dict(zip(columns, row)))
    
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'exclusions': exclusions}),
        'isBase64Encoded': False
    }


def add_exclusion(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    """Добавить исключение (сделать товар недоступным в городе)"""
    body_data = json.loads(event.get('body', '{}'))
    product_id = body_data.get('product_id')
    city_id = body_data.get('city_id')
    
    if not product_id or not city_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'product_id and city_id required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor()
    
    query = f"""
        INSERT INTO t_p90017259_flo_rustic_shop.product_city_exclusions 
        (product_id, city_id)
        VALUES ({int(product_id)}, {int(city_id)})
        ON CONFLICT (product_id, city_id) DO NOTHING
        RETURNING id
    """
    cursor.execute(query)
    
    result = cursor.fetchone()
    conn.commit()
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'id': result[0] if result else None}),
        'isBase64Encoded': False
    }


def remove_exclusion(conn, event: Dict[str, Any]) -> Dict[str, Any]:
    """Удалить исключение (сделать товар доступным в городе)"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    city_id = params.get('city_id')
    
    if not product_id or not city_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'product_id and city_id required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor()
    
    query = f"""
        DELETE FROM t_p90017259_flo_rustic_shop.product_city_exclusions
        WHERE product_id = {int(product_id)} AND city_id = {int(city_id)}
    """
    cursor.execute(query)
    
    conn.commit()
    deleted = cursor.rowcount
    cursor.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'deleted': deleted}),
        'isBase64Encoded': False
    }
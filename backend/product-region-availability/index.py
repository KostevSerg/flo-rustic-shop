"""
API для управления доступностью товаров в регионах.
По умолчанию все товары доступны во всех регионах.
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
    region_id = params.get('region_id')
    
    cursor = conn.cursor()
    
    if product_id:
        query = f"""
            SELECT pre.id, pre.product_id, pre.region_id, r.name as region_name
            FROM t_p90017259_flo_rustic_shop.product_region_exclusions pre
            JOIN t_p90017259_flo_rustic_shop.regions r ON r.id = pre.region_id
            WHERE pre.product_id = {int(product_id)}
            ORDER BY r.name
        """
        cursor.execute(query)
    elif region_id:
        query = f"""
            SELECT pre.id, pre.product_id, pre.region_id, p.name as product_name
            FROM t_p90017259_flo_rustic_shop.product_region_exclusions pre
            JOIN t_p90017259_flo_rustic_shop.products p ON p.id = pre.product_id
            WHERE pre.region_id = {int(region_id)}
            ORDER BY p.name
        """
        cursor.execute(query)
    else:
        cursor.execute("""
            SELECT pre.id, pre.product_id, pre.region_id, 
                   p.name as product_name, r.name as region_name
            FROM t_p90017259_flo_rustic_shop.product_region_exclusions pre
            JOIN t_p90017259_flo_rustic_shop.products p ON p.id = pre.product_id
            JOIN t_p90017259_flo_rustic_shop.regions r ON r.id = pre.region_id
            ORDER BY p.name, r.name
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
    """Добавить исключение (сделать товар недоступным в регионе)"""
    body_data = json.loads(event.get('body', '{}'))
    product_id = body_data.get('product_id')
    region_id = body_data.get('region_id')
    
    if not product_id or not region_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'product_id and region_id required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor()
    
    query = f"""
        INSERT INTO t_p90017259_flo_rustic_shop.product_region_exclusions 
        (product_id, region_id)
        VALUES ({int(product_id)}, {int(region_id)})
        ON CONFLICT (product_id, region_id) DO NOTHING
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
    """Удалить исключение (сделать товар доступным в регионе)"""
    params = event.get('queryStringParameters', {}) or {}
    product_id = params.get('product_id')
    region_id = params.get('region_id')
    
    if not product_id or not region_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'product_id and region_id required'}),
            'isBase64Encoded': False
        }
    
    cursor = conn.cursor()
    
    query = f"""
        DELETE FROM t_p90017259_flo_rustic_shop.product_region_exclusions
        WHERE product_id = {int(product_id)} AND region_id = {int(region_id)}
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

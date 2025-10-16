import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime
import uuid
import requests

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление заказами интернет-магазина
    Args: event - dict с httpMethod, body, queryStringParameters
          context - объект с request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            order_id = params.get('id')
            
            if order_id:
                cursor.execute('''
                    SELECT o.*, c.name as city_name, c.region,
                           pc.code as promo_code, pc.discount_percent as promo_discount
                    FROM orders o
                    LEFT JOIN cities c ON o.city_id = c.id
                    LEFT JOIN promo_codes pc ON o.promo_code_id = pc.id
                    WHERE o.id = %s
                ''', (order_id,))
                order = cursor.fetchone()
                
                if not order:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Order not found'}),
                        'isBase64Encoded': False
                    }
                
                result = dict(order)
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
            else:
                status_filter = params.get('status')
                
                if status_filter:
                    cursor.execute('''
                        SELECT o.*, c.name as city_name, c.region,
                               pc.code as promo_code, pc.discount_percent as promo_discount
                        FROM orders o
                        LEFT JOIN cities c ON o.city_id = c.id
                        LEFT JOIN promo_codes pc ON o.promo_code_id = pc.id
                        WHERE o.status = %s
                        ORDER BY o.created_at DESC
                    ''', (status_filter,))
                else:
                    cursor.execute('''
                        SELECT o.*, c.name as city_name, c.region,
                               pc.code as promo_code, pc.discount_percent as promo_discount
                        FROM orders o
                        LEFT JOIN cities c ON o.city_id = c.id
                        LEFT JOIN promo_codes pc ON o.promo_code_id = pc.id
                        ORDER BY o.created_at DESC
                    ''')
                
                orders = cursor.fetchall()
                result = [dict(order) for order in orders]
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=str),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            params = event.get('queryStringParameters') or {}
            action = params.get('action')
            
            if action == 'create_payment':
                shop_id = os.environ.get('YUKASSA_SHOP_ID')
                secret_key = os.environ.get('YUKASSA_SECRET_KEY')
                
                if not shop_id or not secret_key:
                    return {
                        'statusCode': 500,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Payment not configured'}),
                        'isBase64Encoded': False
                    }
                
                amount = body_data.get('amount')
                order_id = body_data.get('order_id')
                return_url = body_data.get('return_url', 'https://your-site.com/')
                
                if not amount or not order_id:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Amount and order_id required'}),
                        'isBase64Encoded': False
                    }
                
                idempotence_key = str(uuid.uuid4())
                
                payment_data = {
                    'amount': {
                        'value': f'{float(amount):.2f}',
                        'currency': 'RUB'
                    },
                    'confirmation': {
                        'type': 'redirect',
                        'return_url': return_url
                    },
                    'capture': True,
                    'description': f'Заказ #{order_id}',
                    'metadata': {
                        'order_id': str(order_id)
                    }
                }
                
                response = requests.post(
                    'https://api.yookassa.ru/v3/payments',
                    json=payment_data,
                    headers={
                        'Idempotence-Key': idempotence_key,
                        'Content-Type': 'application/json'
                    },
                    auth=(shop_id, secret_key)
                )
                
                if response.status_code != 200:
                    return {
                        'statusCode': 500,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Payment creation failed'}),
                        'isBase64Encoded': False
                    }
                
                payment_info = response.json()
                
                cursor.execute('''
                    UPDATE orders
                    SET payment_id = %s
                    WHERE id = %s
                ''', (payment_info['id'], order_id))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'payment_id': payment_info['id'],
                        'payment_url': payment_info['confirmation']['confirmation_url'],
                        'status': payment_info['status']
                    }),
                    'isBase64Encoded': False
                }
            
            order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{datetime.now().microsecond}"
            
            promo_code = body_data.get('promo_code')
            promo_code_id = None
            
            if promo_code:
                cursor.execute('SELECT id FROM promo_codes WHERE code = %s AND is_active = true', (promo_code,))
                promo_result = cursor.fetchone()
                if promo_result:
                    promo_code_id = promo_result['id']
            
            cursor.execute('''
                INSERT INTO orders (
                    order_number, customer_name, customer_phone, customer_email,
                    city_id, delivery_address, items, total_amount, status,
                    promo_code_id, discount_amount,
                    recipient_name, recipient_phone, sender_name, sender_phone,
                    delivery_date, delivery_time, postcard_text, payment_method
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, order_number
            ''', (
                order_number,
                body_data.get('customer_name'),
                body_data.get('customer_phone'),
                body_data.get('customer_email'),
                body_data.get('city_id'),
                body_data.get('delivery_address'),
                json.dumps(body_data.get('items', [])),
                body_data.get('total_amount'),
                'new',
                promo_code_id,
                body_data.get('discount_amount', 0),
                body_data.get('recipient_name'),
                body_data.get('recipient_phone'),
                body_data.get('sender_name'),
                body_data.get('sender_phone'),
                body_data.get('delivery_date'),
                body_data.get('delivery_time'),
                body_data.get('postcard_text'),
                body_data.get('payment_method', 'cash')
            ))
            
            result = cursor.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(result)),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            order_id = body_data.get('id')
            
            if not order_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order ID required'}),
                    'isBase64Encoded': False
                }
            
            update_fields = []
            update_values = []
            
            if 'status' in body_data:
                update_fields.append('status = %s')
                update_values.append(body_data['status'])
            
            if 'notes' in body_data:
                update_fields.append('notes = %s')
                update_values.append(body_data['notes'])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(order_id)
            
            cursor.execute(f'''
                UPDATE orders
                SET {', '.join(update_fields)}
                WHERE id = %s
                RETURNING id, order_number, status
            ''', update_values)
            
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(result)),
                'isBase64Encoded': False
            }
        
        elif method == 'DELETE':
            params = event.get('queryStringParameters') or {}
            order_id = params.get('id')
            
            if not order_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order ID required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('DELETE FROM orders WHERE id = %s RETURNING id', (order_id,))
            result = cursor.fetchone()
            conn.commit()
            
            if not result:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Order not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()
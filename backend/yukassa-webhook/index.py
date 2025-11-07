import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка webhook уведомлений от ЮKassa о статусе оплаты
    Args: event - dict с httpMethod, body (содержит данные от ЮKassa)
          context - object с request_id
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    notification_type = body_data.get('event')
    payment_object = body_data.get('object', {})
    payment_id = payment_object.get('id')
    payment_status = payment_object.get('status')
    order_id = payment_object.get('metadata', {}).get('order_id')
    
    if not payment_id or not order_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Invalid webhook data'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    new_payment_status = 'pending'
    if payment_status == 'succeeded':
        new_payment_status = 'paid'
    elif payment_status == 'canceled':
        new_payment_status = 'failed'
    
    cursor.execute('''
        UPDATE orders
        SET payment_id = %s, payment_status = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING *
    ''', (payment_id, new_payment_status, order_id))
    
    updated_order = cursor.fetchone()
    conn.commit()
    
    if updated_order and new_payment_status == 'paid':
        order_dict = dict(updated_order)
        if isinstance(order_dict.get('items'), str):
            order_dict['items'] = json.loads(order_dict['items'])
        send_order_email(order_dict)
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'status': 'ok'}),
        'isBase64Encoded': False
    }

def send_order_email(order: dict):
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    smtp_port = os.environ.get('SMTP_PORT', '587')
    
    if not smtp_user or not smtp_password:
        return
    
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новый заказ #{order["order_number"]} - ОПЛАЧЕН'
    msg['From'] = smtp_user
    msg['To'] = smtp_user
    
    items_text = '\n'.join([
        f"  - {item['name']} x {item['quantity']} = {item['price'] * item['quantity']} ₽"
        for item in order.get('items', [])
    ])
    
    discount_text = ''
    if order.get('discount_amount'):
        discount_text = f"\nСкидка: -{order['discount_amount']} ₽"
    
    delivery_info = ''
    if order.get('delivery_date'):
        delivery_info += f"\nДата доставки: {order['delivery_date']}"
    if order.get('delivery_time'):
        delivery_info += f"\nВремя доставки: {order['delivery_time']}"
    
    sender_info = ''
    if order.get('sender_name') or order.get('sender_phone'):
        sender_info = f"\n\nОтправитель:\n{order.get('sender_name', '')}\n{order.get('sender_phone', '')}"
    
    postcard_info = ''
    if order.get('postcard_text'):
        postcard_info = f"\n\nТекст открытки:\n{order['postcard_text']}"
    
    text_content = f'''
Поступил новый заказ №{order["order_number"]}

СТАТУС: ✅ ОПЛАЧЕН

Получатель:
{order.get('recipient_name', order.get('customer_name', ''))}
{order.get('recipient_phone', order.get('customer_phone', ''))}
{order.get('customer_email', '')}
{sender_info}

Адрес доставки:
{order.get('delivery_address', '')}
{delivery_info}
{postcard_info}

Товары:
{items_text}
{discount_text}

Итого: {order["total_amount"]} ₽

Способ оплаты: {order.get('payment_method', 'online')}
Статус оплаты: Оплачен
'''
    
    msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
    
    try:
        server = smtplib.SMTP('smtp.yandex.ru', int(smtp_port))
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        pass
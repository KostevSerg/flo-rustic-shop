import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Send order details via email to store owner
    Args: event with httpMethod, body containing order data
          context with request_id
    Returns: HTTP response with success/error status
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
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        print(f'Получены данные заказа: {body_data}')
        
        order_data = body_data.get('order', {})
        customer = body_data.get('customer', {})
        items = body_data.get('items', [])
        
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.yandex.ru')
        smtp_port_str = os.environ.get('SMTP_PORT', '587')
        smtp_port = int(smtp_port_str) if smtp_port_str.isdigit() else 587
        smtp_user = os.environ.get('SMTP_USER', '')
        smtp_password = os.environ.get('SMTP_PASSWORD', '')
        
        print(f'SMTP настройки: host={smtp_host}, port={smtp_port}, user={smtp_user}, password={"***" if smtp_password else "НЕТ"}')
        
        if not smtp_user or not smtp_password:
            print('ОШИБКА: SMTP credentials не настроены')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'SMTP credentials not configured'}),
                'isBase64Encoded': False
            }
        
        items_html = ''
        for item in items:
            item_id = item.get('id', '')
            item_name = item.get('name', '')
            item_image = item.get('image_url', '')
            product_link = f'https://florustic.ru/product/{item_id}' if item_id else ''
            
            name_with_link = f'<a href="{product_link}" style="color: #2D5016; text-decoration: none; font-weight: 600;">{item_name}</a>' if product_link else item_name
            
            image_html = ''
            if item_image:
                image_html = f'<a href="{product_link}"><img src="{item_image}" alt="{item_name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 2px solid #E8B4B8;"></a>'
            
            items_html += f'''
                <tr>
                    <td style="padding: 15px; border-bottom: 1px solid #eee;">
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="padding-right: 15px;">{image_html}</td>
                                <td>{name_with_link}</td>
                            </tr>
                        </table>
                    </td>
                    <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: center;">{item.get('quantity', 0)} шт</td>
                    <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right;">{item.get('price', 0)} ₽</td>
                    <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">{item.get('price', 0) * item.get('quantity', 0)} ₽</td>
                </tr>
            '''
        
        html_body = f'''
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2D5016; border-bottom: 3px solid #E8B4B8; padding-bottom: 10px;">
                        🌸 Новый заказ FloRustic
                    </h1>
                    
                    <h2 style="color: #2D5016; margin-top: 30px;">Контактные данные</h2>
                    <p><strong>Имя:</strong> {customer.get('name', '')}</p>
                    <p><strong>Телефон:</strong> {customer.get('phone', '')}</p>
                    <p><strong>Email:</strong> {customer.get('email', 'Не указан')}</p>
                    
                    <h2 style="color: #2D5016; margin-top: 30px;">Адрес доставки</h2>
                    <p><strong>Город:</strong> {order_data.get('city', '')}</p>
                    <p><strong>Адрес:</strong> {order_data.get('address', '')}</p>
                    <p><strong>Дата доставки:</strong> {order_data.get('deliveryDate', 'Не указана')}</p>
                    <p><strong>Время доставки:</strong> {order_data.get('deliveryTime', 'Не указано')}</p>
                    
                    <h2 style="color: #2D5016; margin-top: 30px;">Состав заказа</h2>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #f8f9fa;">
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2D5016;">Товар</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2D5016;">Кол-во</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2D5016;">Цена</th>
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #2D5016;">Сумма</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_html}
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #2D5016;">
                        <p style="margin: 5px 0;"><strong>Итого:</strong> {order_data.get('totalPrice', 0)} ₽</p>
                        <p style="margin: 5px 0;"><strong>Способ оплаты:</strong> {order_data.get('paymentMethod', '')}</p>
                    </div>
                    
                    {f'<h2 style="color: #2D5016; margin-top: 30px;">Комментарий</h2><p>{order_data.get("comment", "")}</p>' if order_data.get('comment') else ''}
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                        <p>FloRustic - цветочная мастерская</p>
                    </div>
                </div>
            </body>
        </html>
        '''
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Новый заказ #{context.request_id[:8]} от {customer.get("name", "")}'
        msg['From'] = smtp_user
        msg['To'] = 'florustic@yandex.ru'
        
        html_part = MIMEText(html_body, 'html', 'utf-8')
        msg.attach(html_part)
        
        print(f'Отправка письма на {msg["To"]} от {msg["From"]}')
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            print('TLS соединение установлено')
            server.login(smtp_user, smtp_password)
            print('Авторизация успешна')
            server.send_message(msg)
            print('Письмо отправлено успешно')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'message': 'Order email sent successfully'}),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        print(f'ОШИБКА отправки письма: {str(e)}')
        import traceback
        print(f'Traceback: {traceback.format_exc()}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
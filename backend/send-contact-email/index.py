import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Отправляет email с контактной формы на почту florustic@yandex.ru
    Args: event - dict с httpMethod, body (JSON с name, phone, message)
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response dict со статусом отправки
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
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    name: str = body_data.get('name', '')
    phone: str = body_data.get('phone', '')
    message: str = body_data.get('message', '')
    
    if not name or not phone or not message:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Все поля обязательны для заполнения'})
        }
    
    smtp_user = os.environ.get('SMTP_USER')
    smtp_password = os.environ.get('SMTP_PASSWORD')
    smtp_port_str = os.environ.get('SMTP_PORT', '587')
    
    try:
        smtp_port = int(smtp_port_str)
    except (ValueError, TypeError):
        smtp_port = 587
    
    if not smtp_user or not smtp_password:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'SMTP не настроен'})
        }
    
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = 'florustic@yandex.ru'
    msg['Subject'] = f'Новое сообщение с сайта от {name}'
    
    email_body = f"""
    Новое сообщение с контактной формы:
    
    Имя: {name}
    Телефон: {phone}
    
    Сообщение:
    {message}
    """
    
    msg.attach(MIMEText(email_body, 'plain', 'utf-8'))
    
    try:
        server = smtplib.SMTP('smtp.yandex.ru', smtp_port, timeout=10)
        server.set_debuglevel(0)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        server.quit()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'message': 'Сообщение успешно отправлено'})
        }
    except smtplib.SMTPAuthenticationError as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Ошибка авторизации SMTP. Проверьте логин и пароль приложения'})
        }
    except smtplib.SMTPException as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка SMTP: {str(e)}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Ошибка отправки: {str(e)}'})
        }
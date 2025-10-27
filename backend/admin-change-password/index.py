'''
Business: Change admin password with old password verification
Args: event with httpMethod, body containing oldPassword and newPassword
Returns: HTTP response with success/error status
'''

import json
import os
from typing import Dict, Any
import hashlib

ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH', '')

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
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
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        old_password = body_data.get('oldPassword', '')
        new_password = body_data.get('newPassword', '')
        
        if not old_password or not new_password:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Заполните все поля'})
            }
        
        old_password_hash = hash_password(old_password)
        
        print(f"DEBUG: old_password_hash={old_password_hash}")
        print(f"DEBUG: ADMIN_PASSWORD_HASH={ADMIN_PASSWORD_HASH}")
        print(f"DEBUG: Match={old_password_hash == ADMIN_PASSWORD_HASH}")
        
        if old_password_hash != ADMIN_PASSWORD_HASH:
            return {
                'statusCode': 401,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Неверный старый пароль',
                    'debug': {
                        'received_hash': old_password_hash,
                        'expected_hash': ADMIN_PASSWORD_HASH
                    }
                })
            }
        
        new_password_hash = hash_password(new_password)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Пароль изменён. Новый хеш: ' + new_password_hash,
                'newPasswordHash': new_password_hash
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
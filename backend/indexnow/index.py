'''
Business: Submit URLs to IndexNow API for instant search engine indexing
Args: event - dict with httpMethod, body containing urls array
      context - object with request_id attribute
Returns: HTTP response with submission status
'''

import json
import urllib.request
import urllib.error
from typing import Dict, Any, List

INDEXNOW_KEY = 'f8a7b3c4e2d5f6a9b1c8d7e4f3a2b5c6'
SITE_URL = 'https://florustic.ru'
INDEXNOW_API = 'https://api.indexnow.org/indexnow'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
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
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    urls: List[str] = body_data.get('urls', [])
    
    if not urls:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'URLs required'})
        }
    
    full_urls = [f"{SITE_URL}{url}" if url.startswith('/') else url for url in urls]
    
    payload = {
        'host': 'florustic.ru',
        'key': INDEXNOW_KEY,
        'keyLocation': f'{SITE_URL}/{INDEXNOW_KEY}.txt',
        'urlList': full_urls
    }
    
    try:
        req = urllib.request.Request(
            INDEXNOW_API,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                'Content-Type': 'application/json; charset=utf-8'
            }
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.getcode()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'indexnow_status': status_code,
                    'urls_submitted': len(full_urls),
                    'message': 'URLs submitted to IndexNow'
                })
            }
    
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8', errors='ignore')
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': False,
                'error': f'IndexNow API error: {e.code}',
                'details': error_body
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }

"""
Business: Fetch complete sitemap XML and return it
Args: event - cloud function event, context - cloud function context
Returns: Full sitemap XML as text
"""

import urllib.request
import json
from typing import Dict, Any

SITEMAP_URL = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    with urllib.request.urlopen(SITEMAP_URL) as response:
        xml_content = response.read().decode('utf-8')
    
    url_count = xml_content.count('<url>')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/xml',
            'Access-Control-Allow-Origin': '*',
            'X-URL-Count': str(url_count)
        },
        'isBase64Encoded': False,
        'body': xml_content
    }

import json
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Get sitemap preview - first 100 and last 20 lines only
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        url = 'https://functions.poehali.dev/58b61451-ee69-439e-b94c-195335bd5057'
        
        response = urllib.request.urlopen(url, timeout=30)
        sitemap_content = response.read().decode('utf-8')
        
        lines = sitemap_content.split('\n')
        url_count = sitemap_content.count('<loc>')
        
        # Return ONLY preview data (no full_content)
        result = {
            'success': True,
            'stats': {
                'total_chars': len(sitemap_content),
                'total_lines': len(lines),
                'total_urls': url_count
            },
            'first_100_lines': lines[:100],
            'last_20_lines': lines[-20:]
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }

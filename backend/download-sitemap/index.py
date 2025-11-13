import json
import urllib.request
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Download complete sitemap and return it
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
        
        # Fetch the sitemap
        response = urllib.request.urlopen(url, timeout=30)
        sitemap_content = response.read().decode('utf-8')
        
        # Count URLs
        url_count = sitemap_content.count('<loc>')
        lines = sitemap_content.split('\n')
        
        # Get query params to determine what to return
        query_params = event.get('queryStringParameters') or {}
        mode = query_params.get('mode', 'stats')
        
        if mode == 'full':
            # Return just the XML content
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Content-Disposition': 'attachment; filename="sitemap.xml"'
                },
                'body': sitemap_content,
                'isBase64Encoded': False
            }
        
        # Return statistics and preview
        result = {
            'success': True,
            'total_chars': len(sitemap_content),
            'total_lines': len(lines),
            'total_urls': url_count,
            'first_100_lines': '\n'.join(lines[:100]),
            'last_20_lines': '\n'.join(lines[-20:])
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
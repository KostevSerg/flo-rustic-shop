import json
import os
from datetime import datetime
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Generate RSS feed for customer reviews
    Args: event - dict with httpMethod
          context - object with request_id attribute
    Returns: HTTP response with XML RSS feed
    '''
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Database configuration missing'})
        }
    
    conn = psycopg2.connect(database_url)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('''
        SELECT id, name, city, rating, comment, created_at
        FROM reviews
        ORDER BY created_at DESC
        LIMIT 50
    ''')
    
    reviews = cur.fetchall()
    cur.close()
    conn.close()
    
    now = datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
    
    rss_items = ''
    for review in reviews:
        pub_date = datetime.fromisoformat(str(review['created_at'])).strftime('%a, %d %b %Y %H:%M:%S GMT')
        
        rss_items += f'''
        <item>
            <title>Отзыв от {review['name']} — {review['city']}</title>
            <link>https://florustic.ru/reviews#{review['id']}</link>
            <description><![CDATA[Оценка: {review['rating']}/5. {review['comment']}]]></description>
            <pubDate>{pub_date}</pubDate>
            <guid>https://florustic.ru/reviews#{review['id']}</guid>
        </item>'''
    
    rss_feed = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>FloRustic — Отзывы клиентов</title>
        <link>https://florustic.ru/reviews</link>
        <description>Реальные отзывы клиентов о доставке цветов FloRustic</description>
        <language>ru</language>
        <lastBuildDate>{now}</lastBuildDate>
        <atom:link href="https://functions.poehali.dev/rss" rel="self" type="application/rss+xml" />{rss_items}
    </channel>
</rss>'''
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/rss+xml; charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600'
        },
        'isBase64Encoded': False,
        'body': rss_feed
    }

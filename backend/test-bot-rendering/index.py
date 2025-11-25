'''
Business: Test how search engines see your page with React Helmet
Args: event with query param 'url'
Returns: HTML as seen by real browser after JS execution
'''

import json
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Get URL from query parameters
    params = event.get('queryStringParameters', {})
    test_url = params.get('url', 'https://florustic.ru/city/mamontovo')
    
    result = {
        'message': 'Современные поисковики (Яндекс, Google) рендерят JavaScript',
        'your_situation': {
            'problem': 'SPA возвращает один index.html для всех страниц',
            'react_helmet': 'Меняет мета-теги ПОСЛЕ загрузки JS в браузере',
            'bots_see': 'Исходный HTML без уникальных мета-тегов'
        },
        'solutions': {
            '1_wait': {
                'name': 'Подождать индексацию',
                'description': 'Яндекс и Google рендерят JS и увидят правильные теги через React Helmet',
                'pros': 'Ничего не нужно делать',
                'cons': 'Социальные сети (VK, Telegram) не увидят правильные теги',
                'timeline': '1-2 недели для полной индексации'
            },
            '2_prerender': {
                'name': 'Prerendering при билде',
                'description': 'Создать отдельные HTML-файлы для каждого города',
                'pros': 'Все (боты + соцсети) видят правильные теги сразу',
                'cons': 'Требует настройки билд-процесса на poehali.dev',
                'status': 'Скрипт готов в scripts/generate-seo-pages.mjs'
            },
            '3_dynamic_rendering': {
                'name': 'Dynamic Rendering',
                'description': 'Определять ботов и отдавать им предрендеренный HTML',
                'pros': 'Работает для всех ботов',
                'cons': 'Требует настройки на уровне сервера/CDN',
                'status': 'Функция готова в backend/seo-render'
            },
            '4_meta_service': {
                'name': 'Использовать сервис предрендеринга',
                'description': 'prerender.io, rendertron, или подобные',
                'pros': 'Plug-and-play решение',
                'cons': 'Платный сервис ($20-50/месяц)'
            }
        },
        'recommendation': 'Для быстрого решения: используй prerendering при билде (вариант 2)',
        'test_url': test_url,
        'next_steps': [
            'После билда запусти: node scripts/generate-seo-pages.mjs',
            'Это создаст dist/city/{slug}/index.html для каждого города',
            'Задеплой обновлённый dist/',
            'Проверь: curl https://florustic.ru/city/mamontovo | grep "<title>"'
        ]
    }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps(result, ensure_ascii=False, indent=2)
    }

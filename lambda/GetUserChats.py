import json
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ChatSessions')

# כותרות CORS גלובליות
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
}

def lambda_handler(event, context):
    # תמיכה ב-preflight של OPTIONS
    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps("CORS preflight OK")
        }

    try:
        user_email = event.get('queryStringParameters', {}).get('userEmail')

        if not user_email:
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'Missing userEmail'})
            }

        # סריקה על כל השיחות של המשתמש
        response = table.scan(
            FilterExpression=Attr('user1').eq(user_email) | Attr('user2').eq(user_email)
        )

        items = response.get('Items', [])

        # שמירה של זוגות שיחה ייחודיים
        seen_pairs = set()
        unique_chats = []

        for chat in items:
            user_pair = tuple(sorted([chat['user1'], chat['user2']]))

            if user_pair not in seen_pairs:
                seen_pairs.add(user_pair)
                unique_chats.append(chat)

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps(unique_chats)
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': str(e)})
        }

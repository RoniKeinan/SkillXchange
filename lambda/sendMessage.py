# Lambda: SendMessage
import json
import boto3
from datetime import datetime
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Messages')

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    }

    try:
        body = json.loads(event['body'])
        chat_id = body['chatId']
        sender = body['sender']
        text = body['text']

        item = {
            'chatId': chat_id,
            'timestamp': datetime.utcnow().isoformat(),
            'sender': sender,
            'text': text
        }

        table.put_item(Item=item)

        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'message': 'Message sent'})}
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps(str(e))}

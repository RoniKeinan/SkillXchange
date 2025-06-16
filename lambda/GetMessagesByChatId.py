# Lambda: GetMessagesByChatId
import json
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Messages')

def lambda_handler(event, context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,GET"
    }

    chat_id = event.get("queryStringParameters", {}).get("chatId")
    if not chat_id:
        return {"statusCode": 400, "headers": headers, "body": json.dumps("Missing chatId")}

    try:
        response = table.query(
            KeyConditionExpression=Key('chatId').eq(chat_id),
            ScanIndexForward=True  # Sort ascending by timestamp
        )
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(response['Items'])
        }
    except Exception as e:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps(str(e))}

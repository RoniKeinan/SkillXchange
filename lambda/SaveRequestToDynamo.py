import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SkillExchangeRequests')

def lambda_handler(event, context):
    try:
        request_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        item = {
            'requestId': request_id,
            'fromUserEmail': event['fromUserEmail'],
            'toUserEmail': event['toUserEmail'],
            'offeredSkillId': event['offeredSkillId'],
            'requestedSkillId': event['requestedSkillId'],
            'status': 'pending',
            'createdAt': timestamp
        }

        table.put_item(Item=item)

        # מחזיר את כל הנתונים שהלמדה הבאה צריכה
        return {
            'requestId': request_id,
            'fromUserEmail': event['fromUserEmail'],
            'toUserEmail': event['toUserEmail'],
            'offeredSkillId': event['offeredSkillId'],
            'requestedSkillId': event['requestedSkillId'],
            'fromUserName': event.get('fromUserName', ''),  # אתה יכול לוודא שזה קיים
            'offeredSkillName': event.get('offeredSkillName', ''),
            'requestedSkillName': event.get('requestedSkillName', ''),
            'createdAt': timestamp
        }

    except Exception as e:
        print("Error saving request:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to save request'})
        }

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

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Request saved', 'requestId': request_id})
        }

    except Exception as e:
        print("Error saving request:", str(e))
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Failed to save request'})
        }

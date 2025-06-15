import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('SkillExchangeRequests')

def lambda_handler(event, context):
    try:
        print("🧾 FULL EVENT:", json.dumps(event, indent=2))

        # 🧠 ניתוח נכון של המבנה: event > input או event > body
        if "input" in event:
            body = event["input"]
        elif isinstance(event.get("body"), str):
            body = json.loads(event["body"])
        elif isinstance(event.get("body"), dict):
            body = event["body"]
        else:
            body = event  # אם זה כבר ישירות ה-body

        print("📥 Parsed body:", json.dumps(body, indent=2))

        # ולידציה של שדות חובה
        required_fields = ['fromUserEmail', 'toUserEmail', 'offeredSkillId', 'requestedSkillId']
        missing_fields = [field for field in required_fields if field not in body]

        if missing_fields:
            return {
                'statusCode': 400,
                'headers': {
                    "Access-Control-Allow-Origin": "*"
                },
                'body': json.dumps({
                    'error': 'Missing required fields',
                    'missing': missing_fields
                })
            }

        request_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        item = {
            'requestId': request_id,
            'fromUserEmail': body['fromUserEmail'],
            'toUserEmail': body['toUserEmail'],
            'offeredSkillId': body['offeredSkillId'],
            'requestedSkillId': body['requestedSkillId'],
            'status': body.get('status', 'pending'),
            'createdAt': timestamp
        }

        table.put_item(Item=item)

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": json.dumps({
                'requestId': request_id,
                'fromUserEmail': body['fromUserEmail'],
                'toUserEmail': body['toUserEmail'],
                'offeredSkillId': body['offeredSkillId'],
                'requestedSkillId': body['requestedSkillId'],
                'fromUserName': body.get('fromUserName', ''),
                'offeredSkillName': body.get('offeredSkillName', ''),
                'requestedSkillName': body.get('requestedSkillName', ''),
                'createdAt': timestamp
            })
        }

    except Exception as e:
        print("❌ Error saving request:", str(e))
        return {
            'statusCode': 500,
            'headers': {
                "Access-Control-Allow-Origin": "*"
            },
            'body': json.dumps({'error': 'Failed to save request', 'details': str(e)})
        }

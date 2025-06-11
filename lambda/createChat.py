



import json
import uuid
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = 'ChatSessions'

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))

    # נניח שתקבל:
    # {
    #   "user1": "userA@email.com",
    #   "user2": "userB@email.com",
    #   "status": "Approved"
    # }

    user1 = event.get('user1')
    user2 = event.get('user2')
    status = event.get('status')

    if status != 'Approved':
        return {
            'statusCode': 200,
            'body': json.dumps("User not approved. Chat not created.")
        }

    if not user1 or not user2:
        return {
            'statusCode': 400,
            'body': json.dumps("Missing user1 or user2")
        }

    chat_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()

    table = dynamodb.Table(TABLE_NAME)

    try:
        table.put_item(
            Item={
                'chatId': chat_id,
                'user1': user1,
                'user2': user2,
                'createdAt': created_at
            }
        )
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Chat session created',
                'chatId': chat_id,
                'createdAt': created_at
            })
        }
    except Exception as e:
        print(f"Error creating chat session: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps("Failed to create chat session")
        }


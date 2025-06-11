

import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
stepfunctions = boto3.client('stepfunctions')

# שם הטבלה שלך
TABLE_NAME = 'SkillExchangeRequests'

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))
    
    # דוגמא למה שיכול להיכנס ב-event:
    # {
    #   "taskToken": "xxx",
    #   "requestId": "abc123",
    #   "approved": true
    # }

    task_token = event.get('taskToken')
    request_id = event.get('requestId')
    approved = event.get('approved')

    if not task_token or not request_id or approved is None:
        return {
            'statusCode': 400,
            'body': json.dumps('Missing required parameters: taskToken, requestId, approved')
        }

    table = dynamodb.Table(TABLE_NAME)

    # עדכון הסטטוס בטבלה בהתאם לאישור המשתמש
    new_status = 'Approved' if approved else 'Rejected'

    try:
        response = table.update_item(
            Key={'requestId': request_id},
            UpdateExpression='SET #s = :val',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':val': new_status},
            ReturnValues='UPDATED_NEW'
        )
        print(f"Updated status in DynamoDB: {response}")
    except ClientError as e:
        print(f"Error updating DynamoDB: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error updating database')
        }

    # שליחת האישור חזרה ל-Step Functions
    try:
        if approved:
            sf_response = stepfunctions.send_task_success(
                taskToken=task_token,
                output=json.dumps({'status': new_status})
            )
        else:
            sf_response = stepfunctions.send_task_failure(
                taskToken=task_token,
                error='UserRejected',
                cause='User rejected the request'
            )
        print(f"Sent response to Step Functions: {sf_response}")
    except Exception as e:
        print(f"Error sending response to Step Functions: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps('Error sending response to Step Functions')
        }

    return {
        'statusCode': 200,
        'body': json.dumps(f"Request {request_id} processed with status: {new_status}")
    }

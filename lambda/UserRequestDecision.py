import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
stepfunctions = boto3.client('stepfunctions')

TABLE_NAME = 'SkillExchangeRequests'

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))
    
    task_token = event.get('taskToken')
    request_id = event.get('requestId')
    approved = event.get('approved')
    user1 = event.get('fromUserEmail')  # Request sender
    user2 = event.get('toUserEmail')    # Request receiver

    if not task_token or not request_id or approved is None or not user1 or not user2:
        return {
            'error': 'Missing required parameters',
            'input': event
        }

    table = dynamodb.Table(TABLE_NAME)
    new_status = 'Approved' if approved else 'Rejected'

    # Update DynamoDB request status
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
            'error': 'Failed to update DynamoDB',
            'details': str(e)
        }

    # Notify Step Function of the result
    try:
        if approved:
            sf_response = stepfunctions.send_task_success(
                taskToken=task_token,
                output=json.dumps({
                    'requestId': request_id,
                    'status': new_status,
                    'user1': user1,
                    'user2': user2
                })
            )
            print(f"Sent success to Step Functions: {sf_response}")
        else:
            sf_response = stepfunctions.send_task_failure(
                taskToken=task_token,
                error='UserRejected',
                cause='User declined the skill exchange.'
            )
            print(f"Sent failure to Step Functions: {sf_response}")
    except Exception as e:
        print(f"Error communicating with Step Functions: {e}")
        return {
            'error': 'Failed to send task response',
            'details': str(e)
        }

    # Return output for Step Functions to pass to next step (if needed)
    return {
        'requestId': request_id,
        'status': new_status,
        'user1': user1,
        'user2': user2
    }

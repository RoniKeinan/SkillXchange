import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
stepfunctions = boto3.client('stepfunctions')
TABLE_NAME = 'SkillExchangeRequests'

# Headers for CORS
cors_headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}

def lambda_handler(event, context):
    print("Received event:", json.dumps(event, indent=2))

    # 🔧 תיקון: אם הבקשה הגיעה מה-Frontend, הפיילוד יהיה ב-body כמחרוזת JSON
    if "body" in event:
        try:
            event = json.loads(event["body"])
        except Exception as e:
            return {
                'statusCode': 400,
                'headers': cors_headers,
                'body': json.dumps({
                    'error': 'Failed to parse JSON body',
                    'details': str(e),
                    'rawBody': event.get("body")
                })
            }

    task_token = event.get('taskToken')
    input_data = event.get('input', {})  # כאן נמצא הפיילוד של requestId וכו'

    request_id = input_data.get('requestId')
    approved = input_data.get('approved')
    user1 = event.get('fromUserEmail')
    user2 = event.get('toUserEmail')

    if not request_id or not task_token:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({
                'error': 'Missing required parameters: requestId or taskToken',
                'input': event
            })
        }

    # Step 1: Save taskToken (and maybe status) to DynamoDB
    table = dynamodb.Table(TABLE_NAME)

    try:
        update_expression = 'SET taskToken = :tokenVal'
        expression_values = {':tokenVal': task_token}
        expression_names = {}

        if approved is not None:
            new_status = 'Approved' if approved else 'Rejected'
            update_expression += ', #s = :statusVal'
            expression_values[':statusVal'] = new_status
            expression_names['#s'] = 'status'

        update_args = {
            'Key': {'requestId': request_id},
            'UpdateExpression': update_expression,
            'ExpressionAttributeValues': expression_values,
            'ReturnValues': 'UPDATED_NEW'
        }

        if expression_names:
            update_args['ExpressionAttributeNames'] = expression_names

        response = table.update_item(**update_args)
        print(f"✅ DynamoDB updated: {response}")

    except ClientError as e:
        print(f"❌ DynamoDB update failed: {e}")
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({
                'error': 'Failed to update DynamoDB',
                'details': str(e)
            })
        }

    # Step 2: If decision made, notify Step Function
    if approved is not None:
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
                print(f"✅ Sent success to Step Function: {sf_response}")
            else:
                sf_response = stepfunctions.send_task_failure(
                    taskToken=task_token,
                    error='UserRejected',
                    cause='User declined the skill exchange.'
                )
                print(f"✅ Sent failure to Step Function: {sf_response}")
        except Exception as e:
            print(f"❌ Error sending result to Step Functions: {e}")
            return {
                'statusCode': 500,
                'headers': cors_headers,
                'body': json.dumps({
                    'error': 'Failed to notify Step Function',
                    'details': str(e)
                })
            }

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({
            'message': 'Task processed successfully',
            'requestId': request_id,
            'status': 'SavedTokenOnly' if approved is None else new_status
        })
    }

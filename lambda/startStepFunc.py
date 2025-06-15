import json
import boto3

# Initialize Step Functions client
sfn_client = boto3.client('stepfunctions')

# The ARN of the Step Function you want to start
STEP_FUNCTION_ARN = "arn:aws:states:us-east-1:077645562684:stateMachine:requestStepFunc"

def lambda_handler(event, context):
    try:
        # If API Gateway sent the body as a string, parse it
        if isinstance(event.get("body"), str):
            input_data = json.loads(event["body"])
        else:
            input_data = event.get("body", {})

        response = sfn_client.start_execution(
            stateMachineArn=STEP_FUNCTION_ARN,
            input=json.dumps(input_data)
        )

        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Step Function execution started successfully",
                "executionArn": response["executionArn"],
                "startDate": str(response["startDate"])
            })
        }

    except Exception as e:
        print("Error starting Step Function:", e)
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": "Failed to start Step Function",
                "message": str(e)
            })
        }

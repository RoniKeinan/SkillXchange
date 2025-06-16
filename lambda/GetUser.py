import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table("Users")

def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event))

        # קרא את userId מה-query string
        user_id = event.get("queryStringParameters", {}).get("id")

        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing 'id' query parameter"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }

        response = users_table.get_item(Key={"id": user_id})
        user = response.get("Item")

        if not user:
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "User not found"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }

        return {
            "statusCode": 200,
            "body": json.dumps(user),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        }

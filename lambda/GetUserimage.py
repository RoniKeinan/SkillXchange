import json
import boto3
from boto3.dynamodb.conditions import Attr

dynamodb = boto3.resource('dynamodb')
USERS_TABLE = 'Users'  # Replace with your actual table name

def lambda_handler(event, context):
    try:
        print("Received event:", json.dumps(event))

        # Handle CORS preflight
        if event.get("httpMethod") == "OPTIONS":
            return {
                "statusCode": 200,
                "headers": cors_headers(),
                "body": json.dumps("Preflight OK")
            }

        # Parse body
        body = event.get("body")
        if not body:
            return response(400, {"error": "Missing request body"})

        body = json.loads(body)
        contact_email = body.get("contactEmail")

        if not contact_email:
            return response(400, {"error": "Missing 'contactEmail'"})

        # Scan Users table for the given contactEmail
        table = dynamodb.Table(USERS_TABLE)
        response_scan = table.scan(
            FilterExpression=Attr('email').eq(contact_email)
        )

        items = response_scan.get('Items', [])
        print(items)
        if not items:
            return response(404, {"error": "User not found"})

        user = items[0]
        profile_pic = user.get("image")

        if not profile_pic:
            return response(404, {"error": "Image not found for user"})

        return response(200, {"image": profile_pic})

    except Exception as e:
        print("Error:", str(e))
        return response(500, {"error": "Internal server error"})

def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    }

def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": cors_headers(),
        "body": json.dumps(body)
    }

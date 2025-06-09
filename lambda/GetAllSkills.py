import json
import boto3
from decimal import Decimal

# אתחול DynamoDB
dynamodb = boto3.resource('dynamodb')
TABLE_NAME = "Skills"  # ודא שזה באמת השם של הטבלה שלך
table = dynamodb.Table(TABLE_NAME)

# ממיר Decimal למספרים רגילים עבור JSON
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    try:
        print("Event: ", event)

        if event.get("httpMethod", "").upper() != "GET":
            return {
                "statusCode": 405,
                "body": json.dumps({"error": "Method not allowed"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization"
                }
            }

        # סריקה של כל הפריטים בטבלה
        response = table.scan()
        skills = response.get("Items", [])

        return {
            "statusCode": 200,
            "body": json.dumps({"skills": skills}, default=decimal_default),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization"
            }
        }

    except Exception as e:
        print("Error: ", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization"
            }
        }

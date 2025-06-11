

#!/usr/bin/env python3.9
import json
import boto3
from decimal import Decimal

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table("Users") 

# Helper function to convert Decimal to a JSON-serializable format
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    try:
        # Log the incoming event for debugging
        print("Event: ", event)

        # Parse the JSON body from the request
        body = json.loads(event.get('body', '{}'))

        # Validate the "id" field
        user_id = body.get("id")
        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing 'id' field"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",  # Allow any origin
                    "Access-Control-Allow-Methods": "POST,OPTIONS",  # Allowed methods
                    "Access-Control-Allow-Headers": "Content-Type,Authorization"  # Allowed headers
                }
            }

        # Check if the user exists in the table
        response = table.get_item(Key={"id": user_id})
        user = response.get("Item")

        if user:
            # If the user exists, return the user data
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "User found", "user": user}, default=decimal_default),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",  # Allow any origin
                    "Access-Control-Allow-Methods": "POST,OPTIONS",  # Allowed methods
                    "Access-Control-Allow-Headers": "Content-Type,Authorization"  # Allowed headers
                }
            }

      

        # Prepare the item to be added to the table
        item = {
            "id": user_id,
            "firstName": "",
            "lastName": "",
            "phone": "",
            "email": body["email"],
            "password": "",  # In a real app, hash the password before storing it
            "birthDate": "",  # Optional field
            "city": "",
            "street": "",
            "houseNumber": "",
            "mySkills": [],  # Default to an empty list
           
        }

        # Put the item into the DynamoDB table
        table.put_item(Item=item)

        # Return a success response
        return {
            "statusCode": 201,
            "body": json.dumps({"message": "User created successfully", "user": item}, default=decimal_default),
            "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",  # Allow any origin
                    "Access-Control-Allow-Methods": "POST,OPTIONS",  # Allowed methods
                    "Access-Control-Allow-Headers": "Content-Type,Authorization"  # Allowed headers
                }
        }

    except Exception as e:
        # Handle and log exceptions
        print("Error: ", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",  # Allow any origin
                    "Access-Control-Allow-Methods": "POST,OPTIONS",  # Allowed methods
                    "Access-Control-Allow-Headers": "Content-Type,Authorization"  # Allowed headers
                }
        }
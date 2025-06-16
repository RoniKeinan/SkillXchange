import json
import boto3
import base64
import uuid
from decimal import Decimal

# Initialize AWS services
s3 = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')

# AWS resource names
BUCKET_NAME = "skillxchange-images"
TABLE_NAME = "Skills"
users_table = dynamodb.Table("Users")
table = dynamodb.Table(TABLE_NAME)

def is_valid_base64(data):
    try:
        base64.b64decode(data, validate=True)
        return True
    except Exception:
        return False

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    try:
        print("Event: ", event)

        if event.get("httpMethod", "").upper() != "POST":
            return {
                "statusCode": 405,
                "body": json.dumps({"error": "Method not allowed"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization"
                }
            }

        body = json.loads(event.get('body', '{}'))

        images = body.get('images', [])
        if not isinstance(images, list):
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "'images' must be a list"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST,OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type,Authorization"
                }
            }

        image_urls = []
        for image_data in images:
            if image_data.startswith("http://") or image_data.startswith("https://"):
                image_urls.append(image_data)
            else:
                image = image_data[image_data.find(",") + 1:]
                if not is_valid_base64(image):
                    return {
                        "statusCode": 400,
                        "body": json.dumps({"error": "Invalid base64 image"}),
                        "headers": {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "POST,OPTIONS",
                            "Access-Control-Allow-Headers": "Content-Type,Authorization"
                        }
                    }
                file_name = f"{uuid.uuid4()}.jpg"
                s3.put_object(
                    Bucket=BUCKET_NAME,
                    Key=file_name,
                    Body=base64.b64decode(image),
                    ContentType="image/jpeg"
                )
                image_urls.append(f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}")

        # Create skill item
        new_id = str(uuid.uuid4())
        skill_name = body.get('title')

        item = {
            "id": new_id,
            "skillName": skill_name,
            "category": body.get('category', 'Uncategorized'),
            "description": body.get('description', ''),
            "contactName": body.get('contactName', ''),
            "contactEmail": body.get('contactEmail', ''),
            "images": image_urls
        }
        table.put_item(Item=item)

        # Update user's mySkills
        user_id = body.get('userId')
        if not user_id:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing userId in request"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }

        # Retrieve current user data
        user_response = users_table.get_item(Key={"id": user_id})
        user_item = user_response.get('Item', {})
        existing_skills = user_item.get('mySkills', [])

        # Check for duplicate skill name
        if skill_name in existing_skills:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Skill name already exists in user's mySkills"}),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }

        # Update skills list
        users_table.update_item(
            Key={"id": user_id},
            UpdateExpression="SET mySkills = list_append(if_not_exists(mySkills, :empty_list), :new_skill)",
            ExpressionAttributeValues={
                ":new_skill": [skill_name],
                ":empty_list": []
            }
        )

        return {
            "statusCode": 200,
            "body": json.dumps({"message": "Skill created successfully", "item": item}, default=decimal_default),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
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
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization"
            }
        }

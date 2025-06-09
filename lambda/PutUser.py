#!/usr/bin/env python3.9
import json
import boto3
import base64
import uuid
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table("Users")
s3 = boto3.client('s3')
cognito_idp = boto3.client('cognito-idp')
bucket_name = "userprofilepictures1"

USER_POOL_ID = "us-east-1_qm0UEIZ0L"

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def response(status_code, body):
    return {
        "statusCode": status_code,
        "body": json.dumps(body, default=decimal_default),
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization"
        }
    }

def lambda_handler(event, context):
    try:
        print("Event: ", event)
        body = json.loads(event.get('body', '{}'))

        user_id = body.get("id")
        if not user_id:
            return response(400, {"error": "Missing 'id' field"})

        # Fetch existing user
        response_db = table.get_item(Key={"id": user_id})
        user = response_db.get("Item")

        if not user:
            return response(404, {"error": "User not found"})

        old_email = user.get("email")
        new_email = body.get("email")
        email_changed = new_email and new_email != old_email

        non_updatable_fields = {"id"}

        image_input = body.get("image", "").strip()
        image_url = user.get("image")  # default to existing image

        if image_input.startswith("data:image/"):
            # New base64 image
            try:
                image_data = base64.b64decode(image_input.split(",")[-1])
            except Exception as e:
                return response(400, {"error": f"Invalid image base64 data: {str(e)}"})

            image_filename = f"{user_id}_{uuid.uuid4().hex}.jpg"

            s3.put_object(
                Bucket=bucket_name,
                Key=image_filename,
                Body=image_data,
                ContentType="image/jpeg",
            )

            image_url = f"https://{bucket_name}.s3.amazonaws.com/{image_filename}"

        elif image_input.startswith("http://") or image_input.startswith("https://"):
            # Valid image URL, use as-is
            image_url = image_input

        # else: image was blank or invalid, keep old one

        # Update the body with final image URL (new or existing)
        body["image"] = image_url

        if email_changed:
            new_user_item = user.copy()
            new_user_item.update(body)
            new_user_item["id"] = new_email

            for field in non_updatable_fields:
                if field != "id" and field in new_user_item:
                    del new_user_item[field]

            table.put_item(Item=new_user_item)
            table.delete_item(Key={"id": user_id})

            cognito_idp.admin_update_user_attributes(
                UserPoolId=USER_POOL_ID,
                Username=old_email,
                UserAttributes=[
                    {"Name": "email", "Value": new_email},
                    {"Name": "email_verified", "Value": "false"}
                ]
            )

            updated_user = new_user_item

        else:
            update_expression_parts = []
            expression_attribute_values = {}

            for key, value in body.items():
                if key in non_updatable_fields:
                    continue
                update_expression_parts.append(f"{key} = :{key}")
                expression_attribute_values[f":{key}"] = value

            if not update_expression_parts:
                return response(400, {"error": "No valid fields to update"})

            update_expression = "SET " + ", ".join(update_expression_parts)
            table.update_item(
                Key={"id": user_id},
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )

            updated_user = table.get_item(Key={"id": user_id}).get("Item")

        return response(200, {
            "message": "User updated successfully",
            "updatedUser": updated_user
        })

    except Exception as e:
        print("Error: ", str(e))
        return response(500, {"error": str(e)})

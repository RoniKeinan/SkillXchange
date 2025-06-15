import json
import boto3
import botocore.exceptions

sns = boto3.client('sns')

def sanitize_email_for_topic(email):
    # מחליף תווים לא חוקיים בשם הנושא
    return email.replace("@", "_at_").replace(".", "_dot_").replace("-", "_dash_")

def get_or_create_user_topic(email):
    topic_name = "SkillExchange_" + sanitize_email_for_topic(email)
    response = sns.create_topic(Name=topic_name)
    return response['TopicArn']

def is_already_subscribed(topic_arn, email):
    # בודק האם ה-email כבר מנוי לנושא (מספיק 1 עמוד של מנויים)
    subs = sns.list_subscriptions_by_topic(TopicArn=topic_arn)
    for sub in subs.get('Subscriptions', []):
        if sub['Endpoint'].lower() == email.lower() and sub['Protocol'] == 'email':
            return True
    return False

def lambda_handler(event, context):
    try:
        data = event.get('input', {})

        to_email = data['toUserEmail']
        from_user = data['fromUserName']
        offered_skill = data['offeredSkillName']
        requested_skill = data['requestedSkillName']

        # יוצרים/מקבלים נושא ייחודי למשתמש
        topic_arn = get_or_create_user_topic(to_email)

        # מוודאים שהמשתמש מנוי לנושא, אם לא - נרשום אותו
        if not is_already_subscribed(topic_arn, to_email):
            sns.subscribe(
                TopicArn=topic_arn,
                Protocol='email',
                Endpoint=to_email
            )

        subject = "You've Received a Skill Exchange Request"
        message = f"""
Hello,

You received a new skill exchange request from {from_user}!

🔁 They are offering: {offered_skill}
🎯 They are requesting: {requested_skill}

Please log in to your account to view and respond to this request.

Best,
Your Skill Exchange Team
"""

        sns.publish(
            TopicArn=topic_arn,
            Subject=subject,
            Message=message
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Email sent via SNS',
                'fromUserEmail': data.get('fromUserEmail'),
                'toUserEmail': to_email,
                'fromUserName': from_user,
                'offeredSkillId': data.get('offeredSkillId'),
                'requestedSkillId': data.get('requestedSkillId'),
                'offeredSkillName': offered_skill,
                'requestedSkillName': requested_skill,
                'requestId': data.get('requestId')
            })
        }

    except botocore.exceptions.ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }
    except KeyError as e:
        return {
            'statusCode': 400,
            'body': json.dumps(f'Missing key: {str(e)}')
        }

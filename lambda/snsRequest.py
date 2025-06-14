import json
import boto3
import botocore.exceptions

sns = boto3.client('sns')
TOPIC_NAME = 'SkillExchangeTopic'

def lambda_handler(event, context):
    try:
        to_email = event['toUserEmail']
        from_user = event['fromUserName']
        offered_skill = event['offeredSkillName']
        requested_skill = event['requestedSkillName']

        topic_arn = sns.create_topic(Name=TOPIC_NAME)['TopicArn']

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

        # ✅ מחזיר את כל המידע לשלב הבא ב-State Machine
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Email sent via SNS',
                'fromUserEmail': event['fromUserEmail'],
                'toUserEmail': event['toUserEmail'],
                'fromUserName': event['fromUserName'],
                'offeredSkillId': event['offeredSkillId'],
                'requestedSkillId': event['requestedSkillId'],
                'offeredSkillName': event['offeredSkillName'],
                'requestedSkillName': event['requestedSkillName'],
                'requestId': event['requestId']
            })
        }

    except botocore.exceptions.ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }

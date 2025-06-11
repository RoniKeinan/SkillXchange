


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

        # Step 1: Create or get existing topic
        topic_arn = sns.create_topic(Name=TOPIC_NAME)['TopicArn']

        # Step 2: Subscribe the recipient to the topic (if not already subscribed)
        sns.subscribe(
            TopicArn=topic_arn,
            Protocol='email',
            Endpoint=to_email
        )

        # Step 3: Build message
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

        # Step 4: Publish the message
        sns.publish(
            TopicArn=topic_arn,
            Subject=subject,
            Message=message
        )

        return {
            'statusCode': 200,
            'body': json.dumps('Email request sent via SNS (check your inbox to confirm subscription if needed).')
        }

    except botocore.exceptions.ClientError as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error: {str(e)}')
        }
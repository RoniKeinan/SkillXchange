

import boto3
import json
from datetime import datetime, timedelta

cloudwatch = boto3.client('cloudwatch')

def get_metric(namespace, metric_name, dimensions, stat, period=86400):
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(days=1)

    response = cloudwatch.get_metric_statistics(
        Namespace=namespace,
        MetricName=metric_name,
        Dimensions=dimensions,
        StartTime=start_time,
        EndTime=end_time,
        Period=period,
        Statistics=[stat]
    )

    datapoints = response.get('Datapoints', [])
    return datapoints[0][stat] if datapoints else 0

def lambda_handler(event, context):
    try:
        # Configurable resources
        lambda_function_name = 'SaveRequestToDynamoDB'
        dynamodb_table_name = 'SkillExchangeRequests'

        # Lambda stats
        invocations = int(get_metric(
            'AWS/Lambda', 'Invocations',
            [{'Name': 'FunctionName', 'Value': lambda_function_name}],
            'Sum'
        ))

        errors = int(get_metric(
            'AWS/Lambda', 'Errors',
            [{'Name': 'FunctionName', 'Value': lambda_function_name}],
            'Sum'
        ))

        avg_duration = round(get_metric(
            'AWS/Lambda', 'Duration',
            [{'Name': 'FunctionName', 'Value': lambda_function_name}],
            'Average'
        ))

        # DynamoDB stats
        reads = int(get_metric(
            'AWS/DynamoDB', 'ConsumedReadCapacityUnits',
            [{'Name': 'TableName', 'Value': dynamodb_table_name}],
            'Sum'
        ))

        writes = int(get_metric(
            'AWS/DynamoDB', 'ConsumedWriteCapacityUnits',
            [{'Name': 'TableName', 'Value': dynamodb_table_name}],
            'Sum'
        ))

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            "body": json.dumps({
                "invocationsLast24h": invocations,
                "errorsLast24h": errors,
                "avgDurationMs": avg_duration,
                "dynamoReads": reads,
                "dynamoWrites": writes
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

{
  "Comment": "Skill Exchange Request State Machine",
  "StartAt": "SaveRequestToDynamoDB",
  "States": {
    "SaveRequestToDynamoDB": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:077645562684:function:SaveRequestToDynamoDB:$LATEST",
        "Payload": {
          "input.$": "$"
        }
      },
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException",
            "Lambda.TooManyRequestsException"
          ],
          "IntervalSeconds": 1,
          "MaxAttempts": 3,
          "BackoffRate": 2,
          "JitterStrategy": "FULL"
        }
      ],
      "Next": "snsRequest"
    },
    "snsRequest": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:077645562684:function:SnsRequest:$LATEST",
        "Payload": {
          "input.$": "$.input"
        }
      },
      "Retry": [
        {
          "ErrorEquals": [
            "Lambda.ServiceException",
            "Lambda.AWSLambdaException",
            "Lambda.SdkClientException",
            "Lambda.TooManyRequestsException"
          ],
          "IntervalSeconds": 1,
          "MaxAttempts": 3,
          "BackoffRate": 2,
          "JitterStrategy": "FULL"
        }
      ],
      "Next": "WaitForUserApproval"
    },
    "WaitForUserApproval": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
      "TimeoutSeconds": 86400,
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:077645562684:function:WaitForUserApproval:$LATEST",
        "Payload": {
          "taskToken.$": "$$.Task.Token",
          "input.$": "$.input"
        }
      },
      "Next": "CheckApproval"
    },
    "CheckApproval": {
      "Type": "Choice",
      "Choices": [
        {
          "Variable": "$.status",
          "StringEquals": "Approved",
          "Next": "CreateChat"
        }
      ],
      "Default": "EndProcess"
    },
    "CreateChat": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:077645562684:function:createChat:$LATEST",
        "Payload": {
          "user1.$": "$.input.fromUserEmail",
          "user2.$": "$.input.toUserEmail",
          "status.$": "$.status"
        }
      },
      "End": true
    },
    "EndProcess": {
      "Type": "Succeed"
    }
  }
}

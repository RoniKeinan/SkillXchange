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
      "Next": "ParseBody_SaveRequest"
    },
    "ParseBody_SaveRequest": {
      "Type": "Pass",
      "Parameters": {
        "input.$": "States.StringToJson($.Payload.body)"
      },
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
      "Next": "ParseBody_Sns"
    },
    "ParseBody_Sns": {
      "Type": "Pass",
      "Parameters": {
        "input.$": "States.StringToJson($.Payload.body)"
      },
      "Next": "WaitForUserApproval"
    },
    "WaitForUserApproval": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke.waitForTaskToken",
      "TimeoutSeconds": 86400,
      "Parameters": {
        "FunctionName": "arn:aws:lambda:us-east-1:077645562684:function:UserRequestDecision:$LATEST",
        "Payload": {
          "taskToken.$": "$$.Task.Token",
          "input.$": "$.input"
        }
      },
      "ResultPath": "$.UserDecisionResult",
      "Next": "ParseBody_UserDecision"
    },
    "ParseBody_UserDecision": {
      "Type": "Pass",
      "Parameters": {
        "parsedBody.$": "$.UserDecisionResult",
          "input.$": "$.input"
      },
      "ResultPath": "$.parsed",
      "Next": "ExtractStatus"
    },
    "ExtractStatus": {
      "Type": "Pass",
      "Parameters": {
        "status.$": "$.parsed.parsedBody.status",
        "user1.$": "$.parsed.input.fromUserEmail",
        "user2.$": "$.parsed.input.toUserEmail"
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
          "user1.$": "$.user1",
          "user2.$": "$.user2",
          "status.$": "$.status"
        }
      },
      "Next": "ParseBody_CreateChat"
    },
    "ParseBody_CreateChat": {
      "Type": "Pass",
      "Parameters": {
        "parsedBody.$": "States.StringToJson($.Payload.body)"
      },
      "ResultPath": "$.parsedResult",
      "Next": "ExtractMessage"
    },
    "ExtractMessage": {
      "Type": "Pass",
      "Parameters": {
        "message.$": "$.parsedResult.parsedBody.message"
      },
      "Next": "EndProcess"
    },
    "EndProcess": {
      "Type": "Succeed"
    }
  }
}
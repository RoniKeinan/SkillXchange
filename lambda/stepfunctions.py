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
      "Next": "ParseBody_UserDecision"
    },
   "ParseBody_UserDecision": {
    "Type": "Pass",
    "Parameters": {
      "parsedBody.$": "States.StringToJson($.Payload.body)",
      "input.$": "$.input"
    },
    "ResultPath": "$.parsed",
    "Next": "ExtractStatus"
  },
  "ExtractStatus": {
    "Type": "Pass",
    "Parameters": {
      "status.$": "$.parsed.parsedBody.status",
      "input.$": "$.parsed.input"
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
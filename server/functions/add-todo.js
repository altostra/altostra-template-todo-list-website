//import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid')
const TABLE_NAME = require('../constants')

module.exports.handler = async (event, context) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const { todoText } = JSON.parse(event.body)

    await docClient.put({
      TableName: process.env[TABLE_NAME],
      Item: {
        id: uuid(),
        todoText,
        isDone: false,
      },
      // throws if key already presented,
      ConditionExpression: 'attribute_not_exists(id)',
    }).promise()

    return {
      statusCode: 200,
      body: "Ok"
    };
  }
  catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
}
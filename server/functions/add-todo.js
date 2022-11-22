//import { DocumentClient } from 'aws-sdk/clients/dynamodb'
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid')
const TABLE_NAME = require('../constants')

exports.handler = async (event, context) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const { todoText } = JSON.parse(event.body)

    const item = {
      id: uuid(),
      todoText,
      isDone: false,
    }

    await docClient.put({
      TableName: process.env[TABLE_NAME],
      Item: item,
      // throws if key already presented,
      ConditionExpression: 'attribute_not_exists(id)',
    }).promise()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    };
  }
  catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
}
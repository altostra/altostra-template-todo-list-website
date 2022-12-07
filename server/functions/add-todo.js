const AWS = require('aws-sdk');
const { TABLE_NAME } = require('../constants')
const { createHash, randomBytes } = require('crypto')

exports.handler = async (event, context) => {
  try {
    const docClient = new AWS.DynamoDB.DocumentClient()

    const { todoText } = JSON.parse(event.body)

    const item = {
      id: newId(),
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
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(item),
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: error.message,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
}

function newId() {
  const sha256 = createHash('sha256')

  sha256.update(new Date().toISOString())
  sha256.update(randomBytes(16))

  return sha256.digest('hex')
}
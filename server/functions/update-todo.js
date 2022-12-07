const { DocumentClient } = require('aws-sdk/clients/dynamodb')
const { TABLE_NAME } = require('../constants')

module.exports.handler = async (event, context) => {
  try {
    const docClient = new DocumentClient()
    const id = event.pathParameters.id

    const { todoText, isDone } = JSON.parse(event.body)

    await docClient.update({
      TableName: process.env[TABLE_NAME],
      Key: { id },
      UpdateExpression: 'set todoText = :t, isDone = :s',
      ExpressionAttributeValues: {
        ':t': todoText,
        ':s': isDone
      }
    }).promise()

    const { Item: resultTodo } = await docClient.get({
      TableName: process.env[TABLE_NAME],
      Key: { id },
    }).promise()

    return {
      statusCode: 200,
      body: JSON.stringify(resultTodo),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
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
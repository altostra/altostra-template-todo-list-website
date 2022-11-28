const { DocumentClient } = require('aws-sdk/clients/dynamodb')
const { TABLE_NAME } = require('../constants')

module.exports.handler = async (event, context) => {
  try {
    const docClient = new DocumentClient()

    const { Items: allToDos = [] } = await docClient.scan({
      TableName: process.env[TABLE_NAME],
    }).promise()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(allToDos),
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
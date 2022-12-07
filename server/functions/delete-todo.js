const { DocumentClient } = require('aws-sdk/clients/dynamodb')
const { TABLE_NAME } = require('../constants')

module.exports.handler = async (event, context) => {
  try {
    const docClient = new DocumentClient()

    await docClient.delete({
      TableName: process.env[TABLE_NAME],
      Key: {
        id: event.pathParameters.id
      },
    }).promise();

    return {
      statusCode: 204,
      headers: {
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
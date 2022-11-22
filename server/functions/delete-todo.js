import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import TABLE_NAME from '../constants'

module.exports.handler = async (event, context) => {
  try {
    const docClient = new DocumentClient()

    await docClient.delete({
      TableName: process.env[TABLE_NAME],
      Key: event.pathParameters.id,
    }).promise()

    return {
      statusCode: 200,
      body: "Ok"
    };
  }
  catch (error) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
}
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const productTable = process.env.product_TABLE
const productIndex = process.env.INDEX_NAME

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // product: Get all product items for a current user
  console.log('Processing event: ', event)

  const userId= getUserId(event);
  
  const result = await docClient.query({
    TableName: productTable,
    IndexName: productIndex,
    KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
  }).promise()
  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}

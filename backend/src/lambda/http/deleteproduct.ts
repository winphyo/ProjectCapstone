import 'source-map-support/register'
import * as AWS  from 'aws-sdk'  //default
import * as AWSXRay from 'aws-xray-sdk' //default

const productTable = process.env.product_TABLE 
const XAWS = AWSXRay.captureAWS(AWS)  //default
const docClient = new XAWS.DynamoDB.DocumentClient()  //default

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters.productId
  console.log('Processing event: ', event)
  await deleteproduct(productId);
  // product: Remove a product item by id
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({})
  }
}


async function deleteproduct(productId: string) {
  console.log("Deleting product:", {productId: productId});
  await docClient.delete({
      TableName: productTable,
      Key: {
          "productId": productId
      }
  }).promise();
}
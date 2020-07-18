import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateproductRequest } from '../../requests/UpdateproductRequest'
import * as AWS  from 'aws-sdk'  //default
import * as AWSXRay from 'aws-xray-sdk' //default

const productTable = process.env.product_TABLE 
const XAWS = AWSXRay.captureAWS(AWS)  //default
const docClient = new XAWS.DynamoDB.DocumentClient()  //default

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters.productId
  const updatedproduct: UpdateproductRequest = JSON.parse(event.body)
  console.log('Processing event: ', event)
  console.log('Processing event: ', updatedproduct)
  // product: Update a product item with the provided id using values in the "updatedproduct" object

  await  updateproduct(productId,updatedproduct)
  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
  
}

 async function updateproduct(productId: string, updatedproduct: UpdateproductRequest){

  console.log("Updating product:", {
      productId: productId,
      updatedproduct: updatedproduct
  });
  await docClient.update({
      TableName: productTable,
      Key: {
          "productId": productId
      },
      UpdateExpression: "SET #name = :name, available = :available, description = :description",
      ExpressionAttributeNames: {
        "#name": "name"
    },
      ExpressionAttributeValues: {
          ":name": updatedproduct.name,
          ":available": updatedproduct.available,
          ":description": updatedproduct.description
      }
  }).promise()

  console.log("Update complete.")

}

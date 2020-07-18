import 'source-map-support/register'
import * as uuid from 'uuid'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { CreateproductRequest } from '../../requests/CreateproductRequest'
import { getUserIdFromEvent } from '../../auth/utils'

const productTable = process.env.product_TABLE
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newproduct: CreateproductRequest = JSON.parse(event.body)
  console.log('Processing event: ', event)
  console.log('Processing newproduct: ', newproduct)
  const userId = getUserIdFromEvent(event);
  const productId = await createproduct(userId, newproduct);
  
  // product: Implement creating a new product item
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      productId: productId,
      ...newproduct
    })

}

 async function createproduct (userId: string, newproduct: CreateproductRequest): Promise<string> {
  const productId = uuid.v4();

  const newproductWithAdditionalInfo = {
      userId: userId,
      productId: productId,
      ...newproduct
  }

  await docClient.put({
      TableName: productTable,
      Item: newproductWithAdditionalInfo
  }).promise();

  console.log("Create complete.")

  return productId;

}

}
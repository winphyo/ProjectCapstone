# ProjectCapstone
I have implemented a product catalogue application using AWS Lambda and Serverless framework. 

# Functionality of the application

This application will allow creating/removing/updating/fetching product catalouge. This will save in Dynamo DB. Each product item can optionally have an attachment image. Each user only has access to product items that he/she has created.

# Functions implemented

* `Auth` - this function implemented a custom authorizer for API Gateway that added to all other functions.

* `GetTodos` -  return all product for a current user. A user id can be extracted from a JWT token that is sent by the frontend

* `CreateTodo` -  create a new product catalogue entry by a current user

* `UpdateTodo` - update a  product catalogue entry by a current user.

* `DeleteTodo` -  delete a  product catalogue entry by a current user.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a product catalogue.

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.


# Frontend

The `client` folder contains a web application that can connect to serverless API hosted https://82dy58msee.execute-api.us-east-1.amazonaws.com/dev/products/.

To test on your local -> The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration: 

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

I have created an Auth0 application and already copied "domain" and "client id" to the `config.ts` file in the `client` folder.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless application.

# Postman collection

An alternative way to test  API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project root directory. 

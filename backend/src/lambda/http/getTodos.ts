import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { getAllTodos } from '../../businessLogic/todos'
import { getToken } from '../../auth/utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code 
    
    const token = getToken(event.headers.Authorization);

    const items = await getAllTodos(token);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
)

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../helpers/todos'
import { getToken } from '../../auth/utils'
// import { createTodo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body);

    const token = getToken(event.headers.Authorization);

    // TODO: Implement creating a new TODO item
    const newItem = await createTodo(newTodo, token);

    return {
      statusCode: 201,
      body: JSON.stringify({
        newItem
      })
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
)

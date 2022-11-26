import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { getUploadUrl } from '../../helpers/attachmentUtils'
import { getToken, parseUserId } from '../../auth/utils'
import { generateUrl } from '../../helpers/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const token = getToken(event.headers.Authorization);
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const uploadUrl = generateUrl(todoId, token);
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl,
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

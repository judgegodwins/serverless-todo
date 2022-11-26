
import { S3Handler, S3Event } from 'aws-lambda'
import { updateTodoAttachment } from '../../businessLogic/todos';

export const handler: S3Handler = async (event: S3Event) => {
  await Promise.all(event.Records.map((record) => {
    return updateTodoAttachment(record.s3.object.key)
  }))
}


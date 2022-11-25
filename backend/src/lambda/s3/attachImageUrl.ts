
import { S3Handler, S3Event } from 'aws-lambda'
import { updateTodoAttachment } from '../../helpers/todos';

export const handler: S3Handler = async (event: S3Event) => {
  console.log('records:', event.Records);
  await Promise.all(event.Records.map((record) => {
    console.log('recordkey', record.s3.object.key);
    return updateTodoAttachment(record.s3.object.key)
  }))
}


import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;


// TODO: Implement the fileStogare 

export const getAttachmentUrl = (userId: string, todoId: string) => `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${userId}-todo-${todoId}`;

export const getAttachmentKey = (userId: string, todoId: string) => `${userId}-todo-${todoId}`;

export const getIdsFromKey = (key: string) => key.split('-todo-');

export function getUploadUrl(userId: string, todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: getAttachmentKey(userId, todoId),
    Expires: +urlExpiration,
  });
}

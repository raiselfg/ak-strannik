import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { env } from './env';

const client = new S3Client({
  forcePathStyle: true,
  region: env.AWS_REGION,
  endpoint: env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

function handleStorageError(operation: string, error: unknown): never {
  if (error instanceof S3ServiceException) {
    console.error(`[S3] ${operation} failed: ${error.name}`, {
      status: error.$metadata.httpStatusCode,
    });
  } else {
    console.error(`[S3] ${operation} failed:`, error);
  }
  throw new Error(`Storage ${operation} failed`);
}

export async function putObject(
  objectKey: string,
  body: Buffer,
  contentType: string
) {
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET,
        Key: objectKey,
        Body: body,
        ContentType: contentType,
        ContentLength: body.byteLength,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
  } catch (error) {
    handleStorageError('upload', error);
  }
}

export async function deleteObject(objectKey: string) {
  try {
    await client.send(
      new DeleteObjectCommand({ Bucket: env.AWS_BUCKET, Key: objectKey })
    );
  } catch (error) {
    handleStorageError('delete', error);
  }
}

export async function objectExists(objectKey: string) {
  try {
    await client.send(
      new HeadObjectCommand({ Bucket: env.AWS_BUCKET, Key: objectKey })
    );
    return true;
  } catch (error) {
    if (
      error instanceof S3ServiceException &&
      error.$metadata.httpStatusCode === 404
    )
      return false;
    handleStorageError('head', error);
  }
}

export function getMediaPublicUrl(objectKey: string) {
  const endpoint = env.AWS_ENDPOINT.replace(/\/+$/, '');
  const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/');
  return `${endpoint}/${encodeURIComponent(env.AWS_BUCKET)}/${encodedKey}`;
}

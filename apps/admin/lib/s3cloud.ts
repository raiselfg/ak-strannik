import {
  S3Client,
  PutObjectCommand,
  S3ServiceException,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { env } from './env';
import { ValidationError, StorageError } from './errors';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

let _client: S3Client | null = null;

// Ленивая инициализация клиента — обращается к env только в рантайме.
function getClient(): S3Client {
  if (_client) return _client;

  _client = new S3Client({
    forcePathStyle: true,
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY,
      secretAccessKey: env.AWS_SECRET_KEY,
    },
  });

  return _client;
}

export async function uploadFile(fileBody: File): Promise<string> {
  if (fileBody.size > MAX_FILE_SIZE) {
    throw new ValidationError(
      `File size exceeds 2MB limit: ${(fileBody.size / 1024 / 1024).toFixed(2)}MB`,
    );
  }

  const inputBuffer = Buffer.from(await fileBody.arrayBuffer());
  const fileName = `${randomUUID()}.avif`;

  const optimizedBuffer = await sharp(inputBuffer)
    .resize({
      width: 1280,
      height: 1280,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .avif({
      quality: 70,
      effort: 5,
    })
    .toBuffer();

  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: fileName,
    Body: optimizedBuffer,
    ContentType: 'image/avif',
    ContentLength: optimizedBuffer.byteLength,
    CacheControl: 'public, max-age=31536000, s-maxage=31536000, immutable',
  });

  try {
    await getClient().send(command);
    return `${env.AWS_ENDPOINT}/${env.AWS_BUCKET}/${fileName}`;
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(`[S3] Upload failed: ${error.name}`, {
        status: error.$metadata.httpStatusCode,
        message: error.message,
      });
      throw new StorageError(`Storage failed: ${error.name}`);
    }

    console.error('[S3] Unexpected upload error:', error);
    throw new StorageError('Internal upload error');
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const bucket = env.AWS_BUCKET;
  const fileName = fileUrl.split(`/${bucket}/`)[1];

  if (!fileName) {
    console.warn(`[S3] Attempted to delete invalid file URL: ${fileUrl}`);
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  try {
    await getClient().send(command);
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(`[S3] Delete failed: ${error.name}`, {
        status: error.$metadata.httpStatusCode,
        message: error.message,
      });
      throw new StorageError(`Storage failed: ${error.name}`);
    }

    console.error('[S3] Unexpected delete error:', error);
    throw new StorageError('Internal delete error');
  }
}

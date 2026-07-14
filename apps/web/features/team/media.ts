import 'server-only';

function getMediaBaseUrl() {
  const endpoint = process.env.AWS_ENDPOINT?.replace(/\/+$/, '');
  const bucket = process.env.AWS_BUCKET;

  if (!endpoint || !bucket) {
    throw new Error(
      'AWS_ENDPOINT and AWS_BUCKET are required to build public media URLs'
    );
  }

  return `${endpoint}/${encodeURIComponent(bucket)}`;
}

export function getMediaPublicUrl(objectKey: string) {
  const encodedKey = objectKey.split('/').map(encodeURIComponent).join('/');
  return `${getMediaBaseUrl()}/${encodedKey}`;
}

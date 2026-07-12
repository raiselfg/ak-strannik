import { z } from 'zod';

const cleanEnvString = (value: string) =>
  value.trim().replace(/^['"]|['"]$/g, '');

const envString = z.string().min(1).transform(cleanEnvString);
const envUrl = z
  .url()
  .transform((value) => cleanEnvString(value).replace(/\/+$/, ''));

const envSchema = z.object({
  DATABASE_URL: envUrl,
  BETTER_AUTH_SECRET: envString,
  BETTER_AUTH_URL: envUrl,
  AWS_ENDPOINT: envUrl,
  AWS_REGION: envString,
  AWS_ACCESS_KEY: envString,
  AWS_SECRET_KEY: envString,
  AWS_BUCKET: envString,
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      'Invalid environment variables:',
      z.treeifyError(parsed.error)
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = new Proxy({} as Env, {
  get(_target, prop) {
    if (!cached) cached = loadEnv();
    return cached[prop as keyof Env];
  },
});

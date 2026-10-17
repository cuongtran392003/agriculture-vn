import { ConfigService } from '@nestjs/config';

const LOCAL_JWT_SECRET = 'local-development-only-change-before-deploy';

export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  if (secret) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production. Set it in the environment or .env file.');
  }

  return LOCAL_JWT_SECRET;
}

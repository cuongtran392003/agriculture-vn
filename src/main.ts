import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT ?? 3000);

  app.setGlobalPrefix('api/v1')

  app.enableCors()

  app.useGlobalInterceptors(new ResponseInterceptor())

  app.useGlobalFilters(new AllExceptionsFilter())

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true,
  }))

  if (!admin.apps.length && process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } catch (error) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT must contain valid Firebase service account JSON', { cause: error });
    }
  }
  await app.listen(port, '0.0.0.0');
}
void bootstrap();

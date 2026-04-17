import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port =process.env.PORT

  app.setGlobalPrefix('api/v1')

  app.enableCors()

  app.useGlobalInterceptors(new ResponseInterceptor())

  app.useGlobalFilters(new AllExceptionsFilter())

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    transform:true,
  }))

  if(!admin.apps.length){
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      serviceAccount = require('./config/service-account.json');
    }

    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
    });
  }
  await app.listen(port ?? 3000,"0.0.0.0");
}
bootstrap();

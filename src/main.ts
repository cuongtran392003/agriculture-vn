import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as serviceAccount from './config/service-account.json';


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
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(JSON.stringify(serviceAccount))),
    });
  }
  await app.listen(port ?? 3000,"0.0.0.0");
}
bootstrap();

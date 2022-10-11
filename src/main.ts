import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());

  // const configService = app.get(ConfigService);
  config.getCredentials((err) => {
    if (err) console.log(err.stack);
    // credentials not loaded
    else console.log('Access key:', config.credentials.accessKeyId);
  });

  await app.listen(3000);
}
bootstrap();

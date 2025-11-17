import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.FRONTEND_URL], // or your frontend URL
    credentials: true, // if you use cookies
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that do not have decorators
      forbidNonWhitelisted: true, // throws error for unexpected properties
      transform: true, // transforms payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(process.env.FRONTEND_URL);
}
void bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});

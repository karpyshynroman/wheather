import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AppConfig} from "./app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(AppConfig.port);
}
bootstrap();

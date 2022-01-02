import { NestFactory } from '@nestjs/core';
import { BookModule } from './Book/book.module';
import { UserModule } from './User/user.module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(4000);
}
bootstrap();

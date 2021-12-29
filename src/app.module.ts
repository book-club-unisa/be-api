import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import entities from './entities';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Pallavolo1',
    database: 'books',
    entities,
    synchronize: true,
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

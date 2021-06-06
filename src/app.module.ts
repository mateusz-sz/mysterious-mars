import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NasaApiConsumerModule } from './nasa-api-consumer/nasa-api-consumer.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mysterious_mars_db'),
    NasaApiConsumerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

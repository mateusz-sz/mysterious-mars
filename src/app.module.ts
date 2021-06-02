import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NasaApiUpdaterModule } from './mars-data-updater/nasa-api-updater.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mysterious_mars_db'),
    NasaApiUpdaterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

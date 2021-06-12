import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NasaApiConsumerModule } from './nasa-api-consumer/nasa-api-consumer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WeatherSchema } from './_db-schemas/weather.schema';
import { APODSchema } from './_db-schemas/apod.schema';
import { RoverPhotoSchema } from './_db-schemas/rover-photo-model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mysterious_mars_db'),
    NasaApiConsumerModule,
    MongooseModule.forFeature([
      { name: 'Weather', schema: WeatherSchema },
      { name: 'APOD', schema: APODSchema },
      { name: 'RoverPhoto', schema: RoverPhotoSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

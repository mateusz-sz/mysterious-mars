import { HttpModule, Module } from '@nestjs/common';
import { NasaApiRetrieverService } from './nasa-api-retriever/nasa-api-retriever.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherSchema } from './_db-schemas/weather.schema';
import { MarsDataSaverService } from './mars-data-saver/mars-data-saver.service';
import { APODSchema } from './_db-schemas/apod.schema';
import { RoverPhotoSchema } from './_db-schemas/rover-photo-model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'Weather', schema: WeatherSchema },
      { name: 'APOD', schema: APODSchema },
      { name: 'RoverPhoto', schema: RoverPhotoSchema },
    ]),
    HttpModule,
  ],
  providers: [NasaApiRetrieverService, MarsDataSaverService],
})
export class NasaApiUpdaterModule {}

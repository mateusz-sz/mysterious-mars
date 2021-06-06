import { HttpModule, Module } from '@nestjs/common';
import { ApiRetrieverService } from './api-retriever/api-retriever.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherSchema } from '../_db-schemas/weather.schema';
import { SaverService } from './saver/saver.service';
import { APODSchema } from '../_db-schemas/apod.schema';
import { RoverPhotoSchema } from '../_db-schemas/rover-photo-model';

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
  providers: [ApiRetrieverService, SaverService],
})
export class NasaApiConsumerModule {}

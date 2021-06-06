import { Injectable } from '@nestjs/common';
import { ApiRetrieverService } from '../api-retriever/api-retriever.service';
import { Weather, WeatherDocument } from '../../_db-schemas/weather.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { APOD, APODDocument } from '../../_db-schemas/apod.schema';
import * as moment from 'moment';
import {
  RoverPhoto,
  RoverPhotoDocument,
} from '../../_db-schemas/rover-photo-model';
import { MarsRoverName } from '../../_types/mars-rover-name';

@Injectable()
export class SaverService {
  constructor(
    @InjectModel('Weather')
    private readonly weatherModel: Model<WeatherDocument>,
    @InjectModel('APOD')
    private readonly APODModel: Model<APODDocument>,
    @InjectModel('RoverPhoto')
    private readonly roverPhotoModel: Model<RoverPhotoDocument>,
    private retriever: ApiRetrieverService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  saveWeather(): void {
    this.retriever.getWeather().subscribe(async (newWeather: Weather) => {
      const newWeatherModel = new this.weatherModel(newWeather);
      await newWeatherModel.save();
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  saveAPOD(): void {
    this.retriever.getAPOD().subscribe(async (todayAPOD: APOD) => {
      const todayAPODModel = new this.APODModel(todayAPOD);
      await todayAPODModel.save();
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  saveDailyRoverPhotos(
    roverName: MarsRoverName = 'Curiosity',
    date?: string,
  ): void {
    if (date) {
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        throw new Error('Invalid date! Date must be in format "YYYY-MM-DD"');
      }
    } else {
      date = moment().subtract(1, 'days').format('YYYY-MM-DD');
    }

    this.retriever
      .getRoverPhotosForDate(roverName, date)
      .subscribe(async (photos: RoverPhoto[]) => {
        for (const photo of photos) {
          const photoModel = new this.roverPhotoModel(photo);
          await photoModel.save();
        }
      });
  }
}

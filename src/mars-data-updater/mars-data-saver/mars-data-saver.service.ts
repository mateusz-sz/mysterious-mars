import { Injectable } from '@nestjs/common';
import { NasaApiRetrieverService } from '../nasa-api-retriever/nasa-api-retriever.service';
import { Weather, WeatherDocument } from '../schemas/weather.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { APOD, APODDocument } from '../schemas/apod.schema';

@Injectable()
export class MarsDataSaverService {
  constructor(
    @InjectModel('Weather')
    private readonly weatherModel: Model<WeatherDocument>,
    @InjectModel('APOD')
    private readonly APODModel: Model<APODDocument>,
    private retriever: NasaApiRetrieverService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  saveWeather() {
    this.retriever.getWeather().subscribe(async (newWeather: Weather) => {
      const newWeatherModel = new this.weatherModel(newWeather);
      await newWeatherModel.save();
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  saveAPOD() {
    this.retriever.getAPOD().subscribe(async (todayAPOD: APOD) => {
      const todayAPODModel = new this.APODModel(todayAPOD);
      await todayAPODModel.save();
    });
  }
}

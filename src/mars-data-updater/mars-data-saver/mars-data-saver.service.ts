import { Injectable } from '@nestjs/common';
import { NasaApiRetrieverService } from '../nasa-api-retriever/nasa-api-retriever.service';
import { Weather, WeatherDocument } from '../schemas/weather.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MarsDataSaverService {
  constructor(
    @InjectModel('Weather')
    private readonly weatherModel: Model<WeatherDocument>,
    private retriever: NasaApiRetrieverService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  saveWeather() {
    this.retriever.getWeather().subscribe(async (newWeather: Weather) => {
      const newWeatherModel = new this.weatherModel(newWeather);
      await newWeatherModel.save();
    });
  }
}

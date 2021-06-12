import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WeatherDocument } from './_db-schemas/weather.schema';
import { Model } from 'mongoose';
import { APODDocument } from './_db-schemas/apod.schema';
import * as moment from 'moment';
import { RoverPhoto } from './_db-schemas/rover-photo-model';
import { MarsRoverName } from './_types/mars-rover-name';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Weather')
    private readonly weatherModel: Model<WeatherDocument>,
    @InjectModel('APOD')
    private readonly apodModel: Model<APODDocument>,
    @InjectModel('RoverPhoto')
    private readonly roverPhotoModel: Model<RoverPhoto>,
  ) {}

  async getWeather(): Promise<WeatherDocument> {
    const weathers = await this.weatherModel.find();
    return weathers[weathers.length - 1];
  }

  async getRoverPhotos(
    rover?: MarsRoverName,
    cameraName?: string,
    sort?: 'newestFirst' | 'oldestFirst',
  ): Promise<RoverPhoto[]> {
    const conditionsArr = [];
    if (rover) {
      conditionsArr.push({ roverName: rover });
    }
    if (cameraName) {
      conditionsArr.push({ 'camera.name': cameraName });
    }
    const conditions = rover || cameraName ? { $and: conditionsArr } : {};

    if (sort) {
      return this.roverPhotoModel
        .find(conditions)
        .sort({ earthDate: sort === 'newestFirst' ? 'desc' : 'asc' });
    }
    return this.roverPhotoModel.find(conditions);
  }

  async getAPOD(date?: string): Promise<APODDocument> {
    if (date) {
      if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
        throw new Error(
          'Wrong date format. Date must be in "YYYY-MM-DD" format',
        );
      }
    } else {
      date = moment().format('YYYY-MM-DD');
    }
    return this.apodModel.findOne({ date });
  }
}

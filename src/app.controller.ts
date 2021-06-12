import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { WeatherDocument } from './_db-schemas/weather.schema';
import { APODDocument } from './_db-schemas/apod.schema';
import { RoverPhoto } from './_db-schemas/rover-photo-model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/weather')
  async getWeather(): Promise<WeatherDocument> {
    return this.appService.getWeather();
  }

  @Get('/rover-photos')
  getRoverPhotos(@Query() query): Promise<RoverPhoto[]> {
    return this.appService.getRoverPhotos(
      query.rover,
      query.camera,
      query.sort,
    );
  }

  @Get('/apod')
  async getAPOD(@Query() query): Promise<APODDocument | string> {
    if (query.date) {
      return this.appService.getAPOD(query.date);
    }
    return this.appService.getAPOD();
  }
}

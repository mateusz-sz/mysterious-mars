import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { WeatherApiObject } from '../interfaces/weather-api-object';
import { map } from 'rxjs/operators';
import { Weather } from '../schemas/weather.schema';

@Injectable()
export class NasaApiRetrieverService {
  constructor(private http: HttpService) {}

  getWeather(): Observable<Weather> {
    return this.http
      .get(
        'https://mars.nasa.gov/rss/api/?feed=weather&category=mars2020&feedtype=json',
      )
      .pipe(
        map(
          (response: AxiosResponse<{ sols: WeatherApiObject[] }>) =>
            new Weather(response.data.sols[6]),
        ),
      );
  }
}

import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { WeatherApiObject } from '../interfaces/weather-api-object';
import { map } from 'rxjs/operators';
import { Weather } from '../schemas/weather.schema';
import { APOD } from '../schemas/apod.schema';
import { APODApiObject } from '../interfaces/apod-api-object';
import moment from 'moment';

@Injectable()
export class NasaApiRetrieverService {
  private readonly API_BASE_URL = 'https://api.nasa.gov';
  private readonly API_KEY = 'FX5YScNJBIYW3fRD8qeoNiTMw84QvWo7UxJl9Dpz';

  constructor(private http: HttpService) {}

  static isDateValid(date: string): boolean {
    return moment(date, 'YYYY-MM-DD', true).isValid();
  }

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

  getAPOD(date?: string): Observable<APOD> {
    let requestUrl = `${this.API_BASE_URL}/planetary/apod?api_key=${this.API_KEY}`;
    if (date) {
      if (!NasaApiRetrieverService.isDateValid(date)) {
        throw new Error('Data must be in format "YYYY-MM-DD"');
      }
      requestUrl += `&date=${date}`;
    }

    return this.http
      .get(requestUrl)
      .pipe(
        map(
          (response: AxiosResponse<APODApiObject>) => new APOD(response.data),
        ),
      );
  }

  /**
   * if endDate is not provided, API will return the APODs until today
   */
  getAPODsForDateRange(
    startDate: string,
    endDate?: string,
  ): Observable<APOD[]> {
    if (!NasaApiRetrieverService.isDateValid(startDate)) {
      throw new Error('The date must be in format "YYYY-MM-DD"!');
    }

    let requestUrl = `${this.API_BASE_URL}/planetary/apod?api_key=${this.API_KEY}&start_date=${startDate}`;
    if (endDate) {
      if (!NasaApiRetrieverService.isDateValid(endDate)) {
        throw new Error('The date must be in format "YYYY-MM-DD"!');
      }
      requestUrl += `&end_date=${endDate}`;
    }

    return this.http
      .get(requestUrl)
      .pipe(
        map((response: AxiosResponse<APODApiObject[]>) =>
          response.data.map((APODApiObject) => new APOD(APODApiObject)),
        ),
      );
  }
}

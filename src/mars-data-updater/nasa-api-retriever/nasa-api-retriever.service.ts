import { HttpService, Injectable } from '@nestjs/common';
import { Observable, combineLatest } from 'rxjs';
import { AxiosResponse } from 'axios';
import { WeatherApiObject } from '../_nasa-api-interfaces/weather-api-object';
import { map } from 'rxjs/operators';
import { Weather } from '../_db-schemas/weather.schema';
import { APOD } from '../_db-schemas/apod.schema';
import { APODApiObject } from '../_nasa-api-interfaces/apod-api-object';
import * as moment from 'moment';
import { RoverPhoto } from '../_db-schemas/rover-photo-model';
import { RoverPhotoApiObject } from '../_nasa-api-interfaces/rover-photo-api-object';
import { MarsRoverName } from '../../_types/mars-rover-name';

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
    if (moment(startDate).isAfter(endDate)) {
      throw new Error(
        'Cannot get Mars rover photos for date range. Start date must be before end date!',
      );
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

  getRoverPhotosForDate(
    roverName: MarsRoverName,
    date: string,
  ): Observable<RoverPhoto[]> {
    return this.http
      .get(
        `${this.API_BASE_URL}/mars-photos/api/v1/rovers/${roverName}/photos?earth_date=${date}&api_key=${this.API_KEY}`,
      )
      .pipe(
        map((response: AxiosResponse<{ photos: RoverPhotoApiObject[] }>) => {
          return response.data.photos.map(
            (p: RoverPhotoApiObject) => new RoverPhoto(p),
          );
        }),
      );
  }

  getRoverPhotosForDateRange(
    roverName: MarsRoverName,
    startDate: string,
    endDate: string,
  ): Observable<RoverPhoto[]> {
    if (moment(startDate).isAfter(endDate)) {
      throw new Error(
        'Cannot get Mars rover photos for date range. Start date must be before end date!',
      );
    }
    let dates = [];
    let dateBegin = moment(startDate);
    while (dateBegin <= moment(endDate)) {
      dates = [...dates, dateBegin.format('YYYY-MM-DD')];
      dateBegin = dateBegin.clone().add(1, 'days');
    }

    return combineLatest(
      dates.map((date) => this.getRoverPhotosForDate(roverName, date)),
    ).pipe(map((photosArr: [RoverPhoto[]]) => photosArr.flat()));
  }
}

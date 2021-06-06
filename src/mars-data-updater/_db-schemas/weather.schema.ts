import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WeatherApiObject } from '../_nasa-api-interfaces/weather-api-object';

export type WeatherDocument = Weather & Document;

@Schema()
export class Weather {
  constructor(weather: WeatherApiObject) {
    this.terrestrialDate = weather.terrestrial_date;
    this.sol = weather.sol;
    this.season = weather.season;
    this.minTemp = weather.min_temp;
    this.maxTemp = weather.max_temp;
    this.pressure = weather.pressure;
    this.sunrise = weather.sunrise;
    this.sunset = weather.sunset;
  }

  @Prop({ required: true })
  terrestrialDate: string;

  @Prop()
  sol: string;

  @Prop({ required: true })
  season: string;

  @Prop({ required: true })
  minTemp: number;

  @Prop({ required: true })
  maxTemp: number;

  @Prop({ required: true })
  pressure: number;

  @Prop()
  sunrise: string;

  @Prop()
  sunset: string;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);

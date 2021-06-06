import { Document } from 'mongoose';
import { APODApiObject } from '../nasa-api-consumer/_nasa-api-interfaces/apod-api-object';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type APODDocument = APOD & Document;

@Schema()
export class APOD {
  constructor(apod: APODApiObject) {
    this.date = apod.date;
    this.explanation = apod.explanation;
    this.hdurl = apod.hdurl;
    this.mediaType = apod.media_type;
    this.title = apod.title;
    this.url = apod.url;
  }

  @Prop({ required: true })
  date: string;

  @Prop()
  explanation: string;

  @Prop()
  hdurl: string;

  @Prop()
  mediaType: string;

  @Prop()
  title: string;

  @Prop({ required: true })
  url: string;
}

export const APODSchema = SchemaFactory.createForClass(APOD);

import { RoverPhotoApiObject } from '../nasa-api-consumer/_nasa-api-interfaces/rover-photo-api-object';
import { MarsRoverName } from '../_types/mars-rover-name';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class CameraObject {
  @Prop()
  name: string;

  @Prop()
  fullName: string;

  constructor(name: string, fullName: string) {
    this.name = name;
    this.fullName = fullName;
  }
}
const CameraSchema = SchemaFactory.createForClass(CameraObject);

export type RoverPhotoDocument = RoverPhoto & Document;

@Schema()
export class RoverPhoto {
  @Prop({ type: String })
  roverName: MarsRoverName;

  @Prop({ type: CameraSchema })
  camera: CameraObject;

  @Prop()
  earthDate: string;

  @Prop()
  imgSrc: string;

  constructor(roverPhoto: RoverPhotoApiObject) {
    this.roverName = roverPhoto.rover.name;
    this.camera = new CameraObject(
      roverPhoto.camera.name,
      roverPhoto.camera.full_name,
    );
    this.earthDate = roverPhoto.earth_date;
    this.imgSrc = roverPhoto.img_src;
  }
}

export const RoverPhotoSchema = SchemaFactory.createForClass(RoverPhoto);

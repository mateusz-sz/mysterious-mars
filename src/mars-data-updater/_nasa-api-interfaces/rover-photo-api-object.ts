import { MarsRoverName } from '../../_types/mars-rover-name';

interface RoverApiObject {
  id: number;
  name: MarsRoverName;
  landing_date: string;
  launch_date: string;
  status: string;
}

interface CameraApiObject {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface RoverPhotoApiObject {
  id: number;
  sol: number;
  camera: CameraApiObject;
  img_src: string;
  earth_date: string;
  rover: RoverApiObject;
}

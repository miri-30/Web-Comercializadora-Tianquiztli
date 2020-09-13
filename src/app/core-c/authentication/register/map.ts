// interface
export interface IGeometry {
  type: string;
  coordinates: number[];
}

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  $key?: string;
}

export class GeoJson implements IGeoJson {
  type = "Feature";
  geometry: IGeometry;

  constructor(coordinates) {
    this.geometry = {
      type: "Point",
      coordinates: coordinates,
    };
  }
}

export class FeatureCollection {
  type = "FeatureCollection";
  constructor(public features: Array<GeoJson>) {}
}

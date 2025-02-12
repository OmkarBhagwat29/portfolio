import { Viewer } from "cesium";
import { createContext, useContext } from "react";

export interface CityProps {
  name: string;
  lon: number;
  lat: number;
}

export interface MapBuildingProps {
  type: string;
  polygonType: string;
  height: number;
  id: string;
  coords: number[];
}

export interface MapContextProps {
  city: CityProps | undefined;
  setCity: (city: CityProps) => void;
  loadMap: boolean;
  setLoadMap: (loaded: boolean) => void;

  map: Viewer | undefined;
  setMap: (map: Viewer | undefined) => void;

  selectedMapObjects: MapBuildingProps[];
  setSelectedMapObjects: (objs: MapBuildingProps[]) => void;
}

export const MapContext = createContext<MapContextProps>({
  city: undefined,
  setCity: () => {},
  loadMap: false,
  setLoadMap: () => {},
  map: undefined,
  setMap: () => {},
  selectedMapObjects: [],
  setSelectedMapObjects: () => {},
});

export const useMapContext = () => {
  return useContext(MapContext);
};

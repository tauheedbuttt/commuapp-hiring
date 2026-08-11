export type SavedLocation = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
};

export type GpsCoords = { latitude: number; longitude: number } | null;

export type LocationStoreState = {
  location: SavedLocation | null;
  setLocation: (location: SavedLocation) => void;
};

export type Network = {
  id: number;
  company: string;
  city: string;
  latitude: number;
  longitude: number;
  stations: Station[];
};

export type Station = {
  id: number;
  name: string;
  address: string;
  free_bikes: number;
  empty_slots: number;
  ebikes: number;
  latitude: number;
  longitude: number;
  network: string;
};

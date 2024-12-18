export type Network = {
  id: number;
  external_id: string;
  name: string;
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

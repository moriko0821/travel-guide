export type Location = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

export const locations: Location[] = [
  {
    id: 1,
    name: "Los Angeled Downtown",
    lat: 34.052235,
    lng: -118.243683,
  },
  {
    id: 2,
    name: "Santa Monica",
    lat: 34.019454,
    lng: -118.491191,
  },
  {
    id: 3,
    name: "Hollywood",
    lat: 34.092809,
    lng: -118.328659,
  },
];

export type Location = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  description: string;
  category: string;
};

export const locations: Location[] = [
  {
    id: 1,
    name: "Los Angeled Downtown",
    lat: 34.052235,
    lng: -118.243683,
    description:
      "ロサンゼルス中心部。高層ビルが多く、観光やビジネスの拠点になるエリア。",
    category: "city",
  },
  {
    id: 2,
    name: "Santa Monica",
    lat: 34.019454,
    lng: -118.491191,
    description: "ビーチと桟橋が有名なリゾートエリア。ゆったりした雰囲気。",
    category: "beach",
  },
  {
    id: 3,
    name: "Hollywood",
    lat: 34.092809,
    lng: -118.328659,
    description: "映画の街ハリウッド。観光スポットやエンタメ施設が多い。",
    category: "entertainment",
  },
];

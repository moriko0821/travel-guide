import type { Location } from "../data/locations";

type FavoriteProps = {
  favoriteLocations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (loca: Location) => void;
  favoriteIds: number[];
};

const Favorites = ({
  favoriteLocations,
  selectedLocation,
  setSelectedLocation,
  favoriteIds,
}: FavoriteProps) => {
  return (
    <main className="min-h-screen bg-yellow-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-3xl mt-6 px-2">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          お気に入り一覧
        </h2>
        {favoriteLocations.length === 0 ? (
          <p className="text-xs text-slate-500">
            まだお気に入りはありません。地図ビューで⭐をクリックして追加してください。
          </p>
        ) : (
          <ul className="space-y-2">
            {favoriteLocations.map((loc) => (
              <li
                key={loc.id}
                className="bg-white border-2 border-yellow-900 rounded-md px-3 py-2 text-sm text-slate-800 cursor-pointer hover:bg-yellow-100"
                onClick={() => setSelectedLocation(loc)}
              >
                <div className="font-semibold">{loc.name}</div>
                <div className="text-xs text-slate-500">{loc.category}</div>
              </li>
            ))}
          </ul>
        )}
        {selectedLocation && favoriteIds.includes(selectedLocation.id) && (
          <div className="mt-4 bg-white border border-yellow-900 rounded-md px-4 py-3 shadow-sm text-sm">
            <h3 className="font-semibold mb-1">
              選択中の場所： {selectedLocation.name}
            </h3>
            <p className="text-slate-600">
              緯度： {selectedLocation.lat}, 経度： {selectedLocation.lng}
            </p>
            <p className="text-slate-700 mt-2">
              {selectedLocation.description}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Favorites;

import type { Location } from "../data/locations";

type FavoriteProps = {
  favoriteLocations: Location[];
  selectedLocation: Location | null;
  setSelectedLocation: (loc: Location) => void;
  favoriteIds: number[];
  onDeleteLocation: (id: number) => void;
};

const Favorites = ({
  favoriteLocations,
  selectedLocation,
  setSelectedLocation,
  favoriteIds,
  onDeleteLocation,
}: FavoriteProps) => {
  return (
    <main className="min-h-screen bg-yellow-50 flex flex-col items-center pb-8 px-2">
      <div className="w-full max-w-5xl mt-6 px-2">
        <h2 className="text-3xl text-center font-extrabold text-slate-950 mb-5">
          お気に入り一覧
        </h2>
        {favoriteLocations.length === 0 ? (
          <p className="text-xs text-slate-500">
            まだお気に入りはありません。地図ビューで⭐をクリックして追加してください。
          </p>
        ) : (
          <ul className="space-y-2">
            {favoriteLocations.map((loc) => {
              const photoUrl = loc.photoReference
                ? `https://places.googleapis.com/v1/places/${
                    loc.placeId
                  }/photos/${loc.photoReference}/media?maxWidthPx=600&key=${
                    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                  }`
                : "/no-image.png";
              return (
                <li
                  key={loc.id}
                  className="bg-white border-2 border-yellow-900 rounded-md px-3 py-2 mb-5 text-sm text-slate-800 cursor-pointer hover:bg-yellow-100"
                  onClick={() => setSelectedLocation(loc)}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedLocation(loc)}
                    className="w-full text-left"
                  >
                    <div className="font-bold text-xl">{loc.name}</div>
                    <div className="text-lg mb-3">
                      Category : {loc.category}
                    </div>

                    <img
                      src={photoUrl}
                      alt={loc.name}
                      className="mt-2 w-full object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/noimage.png";
                      }}
                    />
                  </button>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`${loc.name}を削除しますか？`)) {
                          onDeleteLocation(loc.id);
                        }
                      }}
                      className="text-xs px-3 py-1 rounded-full border-2 border-slate-500 text-slate-600 hover:bg-red-100"
                    >
                      削除する
                    </button>
                  </div>
                </li>
              );
            })}
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

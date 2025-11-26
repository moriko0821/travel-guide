import { Search, Star } from "lucide-react";
import Map from "./components/Map";
import { useState, useEffect } from "react";
import { locations } from "./data/locations";
import type { Location } from "./data/locations";

const FAVORITES_STORAGE_KEY = "travel-guide-favorite-ids";

function App() {
  const [input, setInput] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!saved) return [];
    try {
      const parced = JSON.parse(saved) as number[];
      return parced;
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (input.trim() === "") {
      setFilteredLocations(locations);
      return;
    }

    const lowerKeyword = input.toLowerCase();
    const filtered = locations.filter((loc) =>
      loc.name.toLowerCase().includes(lowerKeyword)
    );

    setFilteredLocations(filtered);

    // 検索したら選択中の場所をクリアする
    setSelectedLocation(null);
  }

  function toggleFavorite() {
    if (!selectedLocation) return;

    setFavoriteIds((prevFav) => {
      if (prevFav.includes(selectedLocation.id)) {
        return prevFav.filter((id) => id !== selectedLocation.id);
      } else {
        return [...prevFav, selectedLocation.id];
      }
    });
  }

  const isSelectedFavorite = selectedLocation
    ? favoriteIds.includes(selectedLocation.id)
    : false;

  return (
    <main className="min-h-screen bg-yellow-50 flex flex-col items-center py-8 px-2">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">Travel Guide</h1>
      <form onSubmit={handleSearch} className="flex w-full max-w-sm mx-auto">
        <input
          type="text"
          placeholder="Search"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          className="flex-1 border-2 border-yellow-900 rounded-s-md px-2 py-1.5 bg-white"
        />
        <button
          type="submit"
          className="flex items-center justify-center rounded-e-md bg-yellow-950 text-white hover:bg-yellow-900 px-2"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      <div className="w-full max-w-5xl mt-6 px-2 flex flex-col md:flex-row gap-4">
        <section className="w-full md:w-2/3">
          <Map
            locations={filteredLocations}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
          />
        </section>
        <aside className="md:w-1/3 w-full">
          {selectedLocation ? (
            <div className="bg-white border border-yellow-900 rounded-md px-4 py-3 shadow-sm">
              <h2 className="font-semibold text-lg">
                選択中の場所： {selectedLocation.name}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                緯度： {selectedLocation.lat}, 経度： {selectedLocation.lng}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {selectedLocation.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs bg-yellow-200 px-2 py-1 rounded">
                  #{selectedLocation.category}
                </p>
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className="inline-flex items-center justify-center px-2.5 py-1 border border-yellow-900 rounded-full bg-white hover:bg-yellow-50"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isSelectedFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-600"
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            <p>マーカーをクリックすると、ここに場所の情報が表示されます。</p>
          )}
        </aside>
      </div>
    </main>
  );
}

export default App;

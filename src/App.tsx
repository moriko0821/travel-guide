import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { locations } from "./data/locations";
import type { Location } from "./data/locations";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Favorites from "./pages/Favorites.tsx";
import Sidebar from "./components/Sidebar.tsx";
import MapSection from "./components/MapSection.tsx";

const FAVORITES_STORAGE_KEY = "travel-guide-favorite-ids";
const LOCATIONS_STORAGE_KEY = "travel-guide-all-locations";

function App() {
  const urlLocation = useLocation();

  const [input, setInput] = useState("");
  const [allLocations, setAllLocations] = useState<Location[]>(() => {
    const saved = localStorage.getItem(LOCATIONS_STORAGE_KEY);
    if (!saved) {
      return locations;
    }

    try {
      const parsed = JSON.parse(saved) as Location[];
      return parsed;
    } catch {
      return locations;
    }
  });
  const [filteredLocations, setFilteredLocations] =
    useState<Location[]>(allLocations);
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

  const isSelectedFavorite = selectedLocation
    ? favoriteIds.includes(selectedLocation.id)
    : false;

  const favoriteLocations = allLocations.filter((loc) =>
    favoriteIds.includes(loc.id)
  );

  const favoriteCount = favoriteLocations.length;

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem(LOCATIONS_STORAGE_KEY, JSON.stringify(allLocations));
  }, [allLocations]);

  function handleAddLocationFromMap(data: {
    name: string;
    lat: number;
    lng: number;
    category: string;
    description: string;
  }) {
    const newLocation: Location = {
      id: Date.now(),
      name: data.name,
      lat: data.lat,
      lng: data.lng,
      category: data.category,
      description: data.description,
    };

    setAllLocations((prev) => [...prev, newLocation]);
    setFilteredLocations((prev) => [...prev, newLocation]);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (input.trim() === "") {
      setFilteredLocations(allLocations);
      return;
    }

    const lowerKeyword = input.toLowerCase();
    const filtered = allLocations.filter((loc) =>
      loc.name.toLowerCase().includes(lowerKeyword)
    );

    setFilteredLocations(filtered);

    // 検索したら選択中の場所をクリアする
    setSelectedLocation(null);
  }

  function onToggleFavorite() {
    if (!selectedLocation) return;

    setFavoriteIds((prevFav) => {
      if (prevFav.includes(selectedLocation.id)) {
        return prevFav.filter((id) => id !== selectedLocation.id);
      } else {
        return [...prevFav, selectedLocation.id];
      }
    });
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="min-h-screen bg-yellow-50 flex flex-col items-center py-8 px-2">
            <div className="flex items-center  gap-3 mb-4">
              <h1 className="text-3xl font-bold text-slate-800 leading-none">
                Travel Guide
              </h1>
              {favoriteCount > 0 && (
                <span className="text-xs px-2.5 py-1.5 mt-1.5 rounded-full bg-yellow-900 text-white">
                  お気に入り： {favoriteCount}
                </span>
              )}
            </div>

            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm mx-auto"
            >
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
            <div className="mt-4 flex gap-2">
              <Link
                to="/"
                className={`px-4 py-1 text-sm rounded-full border-2 ${
                  urlLocation.pathname === "/"
                    ? "bg-yellow-900 text-white border-yellow-900"
                    : "bg-white text-slate-700 border-yellow-800"
                }`}
              >
                地図
              </Link>
              <Link
                to="/favorites"
                className={`px-3 py-1 text-sm rounded-full border-2 ${
                  urlLocation.pathname === "/favorites"
                    ? "bg-yellow-900 text-white border-yellow-900"
                    : "bg-white text-slate-700 border-yellow-800"
                }`}
              >
                お気に入り一覧
              </Link>
            </div>

            <div className="w-full max-w-5xl mt-6 px-2 flex flex-col md:flex-row gap-4">
              <MapSection
                locations={filteredLocations}
                onSelectLocation={setSelectedLocation}
                onAddLocation={handleAddLocationFromMap}
              />
              <Sidebar
                selectedLocation={selectedLocation}
                isSelectedFavorite={isSelectedFavorite}
                onToggleFavorite={onToggleFavorite}
                favoriteLocations={favoriteLocations}
                onSetSelectedLocation={setSelectedLocation}
              />
            </div>
          </main>
        }
      />
      <Route
        path="/favorites"
        element={
          <Favorites
            favoriteLocations={favoriteLocations}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            favoriteIds={favoriteIds}
          />
        }
      />
    </Routes>
  );
}

export default App;

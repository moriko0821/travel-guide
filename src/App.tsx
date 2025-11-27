import { Search, Star } from "lucide-react";
import Map from "./components/Map";
import React, { useState, useEffect } from "react";
import { locations } from "./data/locations";
import type { Location } from "./data/locations";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Favorites from "./pages/Favorites.tsx";
import Sidebar from "./components/Sidebar.tsx";

const FAVORITES_STORAGE_KEY = "travel-guide-favorite-ids";

function App() {
  const urlLocation = useLocation();

  const [input, setInput] = useState("");
  const [allLocations, setAllLocations] = useState<Location[]>(locations);
  const [filteredLocations, setFilteredLocations] =
    useState<Location[]>(allLocations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const [newName, setNewName] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");

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

  function handleAddLocation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newName.trim() || !newLat.trim() || !newLng.trim()) {
      return;
    }

    const latNum = Number(newLat);
    const lngNum = Number(newLng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      console.error("緯度、経度は数値で入力してください。");
    }

    const newLocation: Location = {
      id: Date.now(),
      name: newName,
      lat: latNum,
      lng: lngNum,
      category: newCategory || "other",
      description: newDescription || "",
    };

    setAllLocations((prev) => [...prev, newLocation]);
    setFilteredLocations((prev) => [...prev, newLocation]);

    setNewName("");
    setNewLat("");
    setNewLng("");
    setNewCategory("");
    setNewDescription("");
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
              <section className="w-full md:w-2/3 space-y-4">
                <Map
                  locations={filteredLocations}
                  onSelectLocation={(loc) => setSelectedLocation(loc)}
                />

                <form
                  onSubmit={handleAddLocation}
                  className="mt-4 w-full max-w-3xl bg-white border border-yellow-200 rounded-md px-4 py-3 space-y-2"
                >
                  <h2>新しいスポットを追加</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="名前"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="カテゴリ"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="緯度"
                      value={newLat}
                      onChange={(e) => setNewLat(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="経度"
                      value={newLng}
                      onChange={(e) => setNewLng(e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <textarea
                    placeholder="詳細（任意）"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="text-sm px-3 py-1 rounded-full bg-yellow-900 text-white hover:bg-yellow-800"
                    >
                      スポットを追加
                    </button>
                  </div>
                </form>
              </section>
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

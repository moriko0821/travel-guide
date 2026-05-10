import React, { useState, useMemo } from "react";
import type { Location } from "./data/locations";
import type { CategoryFilterType } from "./data/categories";
import { Routes, Route } from "react-router-dom";
import Favorites from "./pages/Favorites.tsx";
import Sidebar from "./components/Sidebar.tsx";
import MapSection from "./components/MapSection.tsx";
import Header from "./components/Header.tsx";
import { useTrip } from "./hooks/useTrip";
import { useLocations } from "./hooks/useLocations";
import { useFavorites } from "./hooks/useFavorites";

function App() {
  const { tripId, tripName, tripNameLoading, tripNameError, updateTripName } =
    useTrip();
  const {
    locations: allLocations,
    locationsLoading,
    locationsError,
    addLocation,
    updateLocation,
    deleteLocation,
  } = useLocations(tripId);
  const { favoriteIds, toggleFavorite, removeFavoriteLocally } =
    useFavorites(tripId);

  const [input, setInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterType>("all");

  const isSelectedFavorite = selectedLocation
    ? favoriteIds.includes(selectedLocation.id)
    : false;

  const favoriteLocations = allLocations.filter((loc) =>
    favoriteIds.includes(loc.id)
  );

  const favoriteCount = favoriteLocations.length;

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchKeyword(input.trim());
    setSelectedLocation(null);
  }

  async function handleDeleteLocation(id: number) {
    const ok = await deleteLocation(id);
    if (!ok) return;

    removeFavoriteLocally(id);
    setSelectedLocation((current) =>
      current && current.id === id ? null : current
    );
  }

  async function handleUpdateLocation(loc: Location) {
    const updated = await updateLocation(loc);
    if (!updated) return;

    setSelectedLocation((prev) =>
      prev && prev.id === updated.id ? updated : prev
    );
  }

  // 検索キーワードとカテゴリフィルターを適用した派生リスト
  const visibleLocation = useMemo<Location[]>(() => {
    let list = allLocations;

    if (searchKeyword) {
      const lower = searchKeyword.toLowerCase();
      list = list.filter((loc) => loc.name.toLowerCase().includes(lower));
    }

    if (categoryFilter !== "all") {
      list = list.filter((loc) => loc.category === categoryFilter);
    }

    return list;
  }, [allLocations, searchKeyword, categoryFilter]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="min-h-screen bg-yellow-50 flex flex-col items-center py-8 px-2">
            <Header
              favoriteCount={favoriteCount}
              input={input}
              setInput={setInput}
              handleSearch={handleSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              tripName={tripName}
              tripNameLoading={tripNameLoading}
              tripNameError={tripNameError}
              onSaveTripName={updateTripName}
            />
            {locationsLoading && (
              <div className="mt-4 text-sm text-slate-700">
                スポットを読み込み中...
              </div>
            )}
            {locationsError && (
              <div className="mt-4 text-sm text-red-600">
                読み込みに失敗しました：{locationsError}
              </div>
            )}
            {!locationsLoading &&
              !locationsError &&
              allLocations.length === 0 && (
                <div className="mt-4 w-full max-w-2xl rounded-lg border border-yellow-900 bg-white py-3 px-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-800">
                    スポットがまだありません
                  </div>
                  <div className="mt-1">
                    下で新しいスポットを追加するか、地図をクリックして追加してみてください！
                  </div>
                </div>
              )}
            <div className="w-full max-w-5xl mt-6 px-2 grid grid-cols-1 md:grid-cols-3  gap-4">
              <MapSection
                locations={visibleLocation}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                onAddLocation={addLocation}
              />
              <Sidebar
                selectedLocation={selectedLocation}
                isSelectedFavorite={isSelectedFavorite}
                onToggleFavorite={() => {
                  if (!selectedLocation) return;
                  toggleFavorite(selectedLocation.id);
                }}
                favoriteLocations={favoriteLocations}
                onSetSelectedLocation={setSelectedLocation}
                onDeleteLocation={handleDeleteLocation}
                onClearSelectedLocation={() => setSelectedLocation(null)}
                onUpdateLocation={handleUpdateLocation}
              />
            </div>
          </main>
        }
      />
      <Route
        path="/favorites"
        element={
          <main className="w-full min-h-screen bg-yellow-50 flex flex-col  py-8 px-2">
            <Header
              favoriteCount={favoriteCount}
              input={input}
              setInput={setInput}
              handleSearch={handleSearch}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              tripName={tripName}
              tripNameLoading={tripNameLoading}
              tripNameError={tripNameError}
              onSaveTripName={updateTripName}
            />
            {favoriteLocations.length === 0 && (
              <div className="mt-4 w-full max-w-2xl rounded-lg border border-yellow-900 bg-white py-3 px-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-800">
                  お気に入りがまだありません
                </div>
                <div className="mt-1">
                  地図ページでスポットを選んで、⭐ボタンからお気に入りに追加できます！
                </div>
              </div>
            )}
            <Favorites
              favoriteLocations={favoriteLocations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              favoriteIds={favoriteIds}
              onRemoveFavorite={toggleFavorite}
            />
          </main>
        }
      />
    </Routes>
  );
}

export default App;

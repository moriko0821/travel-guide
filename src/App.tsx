import React, { useState, useEffect } from "react";
import type { Location } from "./data/locations";
import { Routes, Route } from "react-router-dom";
import Favorites from "./pages/Favorites.tsx";
import Sidebar from "./components/Sidebar.tsx";
import MapSection from "./components/MapSection.tsx";
import Header from "./components/Header.tsx";
import { supabase } from "./lib/supabaseClient.ts";

const FAVORITES_STORAGE_KEY = "travel-guide-favorite-ids";

function App() {
  const [tripId, setTripId] = useState<string | null>(null);

  const [input, setInput] = useState("");
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
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

  type CategoryFilterType =
    | "all"
    | "city"
    | "nature"
    | "restaurant"
    | "museum"
    | "hotel"
    | "other";

  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilterType>("all");

  const isSelectedFavorite = selectedLocation
    ? favoriteIds.includes(selectedLocation.id)
    : false;

  const favoriteLocations = allLocations.filter((loc) =>
    favoriteIds.includes(loc.id)
  );

  const favoriteCount = favoriteLocations.length;

  // convert location data from supabase to this app's location type
  function toLocation(row: any): Location {
    return {
      id: Number(row.id),
      name: row.name,
      lat: row.lat,
      lng: row.lng,
      category: row.category,
      description: row.description ?? "",
      imageUrl: row.image_url ?? "",
      placeId: row.place_id ?? "",
    };
  }

  useEffect(() => {
    console.log("ちぇっく", tripId);
    async function initTripUrl() {
      const url = new URL(window.location.href);
      const tripFromUrl = url.searchParams.get("trip");

      if (tripFromUrl) {
        setTripId(tripFromUrl);
        return;
      }

      const { data, error } = await supabase
        .from("trips")
        .insert({ name: "Your Trip" })
        .select("id")
        .single();

      if (error) {
        console.error(error);
        alert("Tripの作成に失敗しました");
        return;
      }

      const newTripId = data.id as string;

      url.searchParams.set("trip", newTripId);
      window.history.replaceState({}, "", url.toString());

      setTripId(newTripId);
    }

    initTripUrl();
  }, []);

  useEffect(() => {
    async function loadFromSupabase() {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase load error:", error);
        return;
      }

      if (data && data.length > 0) {
        const locations = data.map(toLocation);
        setAllLocations(locations);
        setFilteredLocations(locations);
      }
    }

    loadFromSupabase();
  }, []);

  async function handleAddLocationFromMap(data: {
    name: string;
    lat: number;
    lng: number;
    category: string;
    description: string;
    imageUrl?: string;
    placeId?: string;
  }) {
    const { data: inserted, error } = await supabase
      .from("locations")
      .insert({
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        category: data.category,
        description: data.description,
        image_url: data.imageUrl ?? "",
        place_id: data.placeId ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      alert("Supabaseへの保存に失敗しました：" + error.message);
      return;
    }

    const newLocation: Location = {
      id: inserted.id,
      name: inserted.name,
      lat: inserted.lat,
      lng: inserted.lng,
      category: inserted.category,
      description: inserted.description,
      imageUrl: inserted.image_Url ?? "",
      placeId: inserted.place_id ?? undefined,
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

  async function handleDeleteLocation(id: number) {
    const { error } = await supabase.from("locations").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      alert("削除に失敗しました：" + error.message);
      return;
    }

    setAllLocations((prev) => prev.filter((loc) => loc.id !== id));
    setFilteredLocations((prev) => prev.filter((loc) => loc.id !== id));
    setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
    setSelectedLocation((current) =>
      current && current.id === id ? null : current
    );
  }

  async function handleUpdateLocation(loc: Location) {
    const { data: updated, error } = await supabase
      .from("locations")
      .update({
        name: loc.name,
        lat: loc.lat,
        lng: loc.lng,
        category: loc.category,
        description: loc.description,
        image_url: loc.imageUrl ?? "",
        place_id: loc.placeId ?? null,
      })
      .eq("id", loc.id)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase update error", error);
      alert("更新に失敗しました： " + error.message);
      return;
    }

    const updatedLocation = toLocation(updated);

    setAllLocations((prev) =>
      prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
    );

    setFilteredLocations((prev) =>
      prev.map((loc) => (loc.id === updatedLocation.id ? updatedLocation : loc))
    );

    setSelectedLocation((prev) =>
      prev && prev.id === updatedLocation.id ? updatedLocation : prev
    );
  }

  // Search result with category Filter and sorted
  const visibleLocation: Location[] = (() => {
    let list = filteredLocations;

    if (categoryFilter !== "all") {
      list = list.filter((loc) => loc.category === categoryFilter);
    }

    return list;
  })();

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
            />
            <div className="w-full max-w-5xl mt-6 px-2 grid grid-cols-1 md:grid-cols-3  gap-4">
              <MapSection
                locations={visibleLocation}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                onAddLocation={handleAddLocationFromMap}
              />
              <Sidebar
                selectedLocation={selectedLocation}
                isSelectedFavorite={isSelectedFavorite}
                onToggleFavorite={onToggleFavorite}
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
            />
            <Favorites
              favoriteLocations={favoriteLocations}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              favoriteIds={favoriteIds}
              onDeleteLocation={handleDeleteLocation}
            />
          </main>
        }
      />
    </Routes>
  );
}

export default App;

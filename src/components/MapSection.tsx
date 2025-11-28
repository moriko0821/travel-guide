import React, { useState } from "react";
import type { Location } from "../data/locations";
import Map from "./Map";

type MapSectionProps = {
  locations: Location[];
  onSelectLocation: (loc: Location) => void;
  onAddLocation: (data: {
    name: string;
    lat: number;
    lng: number;
    category: string;
    description: string;
  }) => void;
};

type Suggestion = {
  description: string;
  placeId: string;
};

const MapSection = ({
  locations,
  onSelectLocation,
  onAddLocation,
}: MapSectionProps) => {
  const [newName, setNewName] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [suggestions, setSuggegstions] = useState<Suggestion[]>([]);

  function handleSearchByName() {
    if (!newName.trim()) {
      return;
    }

    if (!(window as any).google || !(window as any).google.maps) {
      console.error("Google Maps API がまだよみこまれていません。");
      return;
    }

    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      query: newName,
      fields: ["geometry", "name"],
    };

    service.findPlaceFromQuery(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results[0]?.geometry?.location
      ) {
        const loc = results[0].geometry.location;
        const lat = loc.lat();
        const lng = loc.lng();

        setNewLat(lat.toString());
        setNewLng(lng.toString());

        console.log("取得して座標： ", lat, lng);
      } else {
        console.error("場所が見つかりませんでした： ", status);
      }
    });
  }

  // fetch suggestion asynchronously while a user is entering data.
  function fetchSuggestions(input: string) {
    if (!input.trim()) {
      setSuggegstions([]);
      return;
    }

    if (
      typeof window === "undefined" ||
      !("google" in window) ||
      !google.maps?.places
    ) {
      return;
    }

    const service = new google.maps.places.AutocompleteService();

    service.getPlacePredictions({ input }, (predictions, status) => {
      if (
        status !== google.maps.places.PlacesServiceStatus.OK ||
        !predictions
      ) {
        setSuggegstions([]);
        return;
      }

      const list: Suggestion[] = predictions.slice(0, 5).map((p) => ({
        description: p.description ?? "",
        placeId: p.place_id ?? "",
      }));
      setSuggegstions(list);
    });
  }

  function handleSelectSuggestion(sug: Suggestion) {
    setNewName(sug.description);
    setSuggegstions([]);

    if (
      typeof window === "undefined" ||
      !("google" in window) ||
      !google.maps?.places
    ) {
      return;
    }
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId: sug.placeId,
        fields: ["geometry", "name"],
      },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const loc = place.geometry.location;
          setNewLat(loc.lat().toString());
          setNewLng(loc.lng().toString());
        }
      }
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newName.trim() || !newLat.trim() || !newLng.trim()) {
      return;
    }

    const latNum = Number(newLat);
    const lngNum = Number(newLng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      console.error("緯度、経度は数値で入力してください。");
      return;
    }

    onAddLocation({
      name: newName,
      lat: latNum,
      lng: lngNum,
      category: newCategory || "other",
      description: newDescription || "",
    });

    setNewName("");
    setNewLat("");
    setNewLng("");
    setNewCategory("");
    setNewDescription("");
  }

  return (
    <section className="w-full md:w-2/3 space-y-4">
      <Map locations={locations} onSelectLocation={onSelectLocation} />

      <form
        onSubmit={handleSubmit}
        className="mt-4 w-full max-w-3xl bg-white border border-yellow-200 rounded-md px-4 py-3 space-y-2"
      >
        <h2>新しいスポットを追加</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="名前"
              value={newName}
              onChange={(e) => {
                const value = e.target.value;
                setNewName(value);
                fetchSuggestions(value);
              }}
              className="border rounded px-2 py-1 text-sm flex-1"
            />
            <button
              type="button"
              onClick={handleSearchByName}
              className="text-xs px-2 py-1 rounded-full border border-yellow-900 bg-white hover:bg-yellow-50"
            >
              座標検索
            </button>
          </div>
          {suggestions.length > 0 && (
            <ul className="mt-1 border rounded bg-white shadow text-sm max-h-40 overflow-y-auto">
              {suggestions.map((sug) => (
                <li
                  key={sug.placeId}
                  className="px-2 py-1 hover:bg-yellow-50 cursor-pointer"
                  onClick={() => handleSelectSuggestion(sug)}
                >
                  {sug.description}
                </li>
              ))}
            </ul>
          )}

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
          className="border rounded px-2 py-1 text-sm w-full"
          rows={2}
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
  );
};

export default MapSection;

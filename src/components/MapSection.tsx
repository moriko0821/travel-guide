import React, { useState } from "react";
import type { Location } from "../data/locations";
import Map from "./Map";
import { ChevronDown } from "lucide-react";
import { CATEGORY_OPTIONS } from "../data/categories";

type MapSectionProps = {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (loc: Location) => void;
  onAddLocation: (data: {
    name: string;
    lat: number;
    lng: number;
    category: string;
    description: string;
    placeId?: string;
    photoReference?: string;
  }) => void;
};

type Suggestion = {
  description: string;
  placeId: string;
};

const MapSection = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onAddLocation,
}: MapSectionProps) => {
  const [newName, setNewName] = useState("");
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPhotoRef, setNewPhotoRef] = useState("");
  const [newPlaceId, setNewPlaceId] = useState<string | undefined>(undefined);
  const [newImageUrl, setNewImageUrl] = useState("");

  const [suggestions, setSuggegstions] = useState<Suggestion[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

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

  async function fetchPhotoRefByPlaceId(placeId: string): Promise<string> {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "photos",
        },
      }
    );

    if (!res.ok) {
      console.error("places details failed:", res.status, await res.text());
      return "";
    }

    const json = await res.json();

    const name: string | undefined = json?.photos?.[0]?.name;
    if (!name) return "";

    const parts = name.split("/photos/");
    const photoRef = parts[1] ?? "";
    return photoRef;
  }

  function handleSelectSuggestion(sug: Suggestion) {
    setNewName(sug.description);
    setNewPlaceId(sug.placeId);
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

          (async () => {
            const ref = await fetchPhotoRefByPlaceId(sug.placeId);
            setNewPhotoRef(ref);
          })();
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

    onAddLocation({
      name: newName,
      lat: latNum,
      lng: lngNum,
      category: newCategory || "other",
      description: newDescription || "",
      photoReference: newPhotoRef || "",
      placeId: newPlaceId,
    });

    setNewName("");
    setNewLat("");
    setNewLng("");
    setNewCategory("");
    setNewDescription("");
    setNewImageUrl("");
  }

  return (
    <section className="w-full md:col-span-2 space-y-4">
      <Map
        locations={locations}
        selectedLocation={selectedLocation}
        onSelectLocation={onSelectLocation}
      />

      <form
        onSubmit={handleSubmit}
        className="mt-4 w-full max-w-3xl bg-white border-3 border-yellow-900 rounded-md px-4 py-2 space-y-2"
      >
        <button
          type="button"
          onClick={() => setIsFormOpen((prev) => !prev)}
          className="w-full flex items-center justify-between"
        >
          <h2 className="font-bold sm:text-lg">新しいスポットを追加</h2>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isFormOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isFormOpen && (
          <>
            <div className="grid grid-cols-1 gap-2 mt-3">
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
                  className="border-2 rounded px-2 py-1 text-sm flex-1"
                />
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
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="border-2 rounded px-2 py-1 text-sm"
              >
                <option value="">カテゴリを選択</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="詳細（任意）"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border-2 rounded px-2 py-1 text-sm w-full"
              rows={2}
            />
            <div className="flex justify-end mb-1.5">
              <button
                type="submit"
                className="px-3 py-1 rounded-full bg-yellow-900 text-white hover:bg-yellow-800"
              >
                スポットを追加
              </button>
            </div>
          </>
        )}
      </form>
    </section>
  );
};

export default MapSection;

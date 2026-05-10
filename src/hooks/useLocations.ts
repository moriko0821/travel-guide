import { useEffect, useState } from "react";
import type { Location } from "../data/locations";
import { supabase } from "../lib/supabaseClient";

function toLocation(row: any): Location {
  return {
    id: Number(row.id),
    name: row.name,
    lat: row.lat,
    lng: row.lng,
    category: row.category,
    description: row.description ?? "",
    photoReference: row.photo_reference ?? undefined,
    placeId: row.place_id ?? undefined,
  };
}

export type AddLocationInput = {
  name: string;
  lat: number;
  lng: number;
  category: string;
  description: string;
  placeId?: string;
  photoReference?: string;
};

export function useLocations(tripId: string | null) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsError, setLocationsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFromSupabase() {
      if (!tripId) return;

      setLocationsLoading(true);
      setLocationsError(null);

      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase load error:", error);
        setLocationsError(error.message);
        setLocationsLoading(false);
        return;
      }

      setLocations((data ?? []).map(toLocation));
      setLocationsLoading(false);
    }

    loadFromSupabase();
  }, [tripId]);

  async function addLocation(data: AddLocationInput) {
    const { data: inserted, error } = await supabase
      .from("locations")
      .insert({
        trip_id: tripId,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        category: data.category,
        description: data.description,
        place_id: data.placeId ?? null,
        photo_reference: data.photoReference ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error(error);
      alert("Supabaseへの保存に失敗しました：" + error.message);
      return;
    }

    setLocations((prev) => [...prev, toLocation(inserted)]);
  }

  async function updateLocation(loc: Location) {
    const { data: updated, error } = await supabase
      .from("locations")
      .update({
        name: loc.name,
        lat: loc.lat,
        lng: loc.lng,
        category: loc.category,
        description: loc.description,
        place_id: loc.placeId ?? null,
      })
      .eq("id", loc.id)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase update error", error);
      alert("更新に失敗しました： " + error.message);
      return null;
    }

    const updatedLocation = toLocation(updated);

    setLocations((prev) =>
      prev.map((l) => (l.id === updatedLocation.id ? updatedLocation : l))
    );

    return updatedLocation;
  }

  async function deleteLocation(id: number) {
    const { error } = await supabase.from("locations").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      alert("削除に失敗しました：" + error.message);
      return false;
    }

    setLocations((prev) => prev.filter((loc) => loc.id !== id));
    return true;
  }

  return {
    locations,
    locationsLoading,
    locationsError,
    addLocation,
    updateLocation,
    deleteLocation,
  };
}

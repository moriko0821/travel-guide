import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useFavorites(tripId: string | null) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadFavorites() {
      if (!tripId) return;

      const { data, error } = await supabase
        .from("favorites")
        .select("location_id")
        .eq("trip_id", tripId);

      if (error) {
        console.error("loadFavorites error:", error);
        alert("お気に入りの読み込みに失敗しました：" + error.message);
        return;
      }

      const ids = (data ?? []).map((row: any) => Number(row.location_id));
      setFavoriteIds(ids);
    }

    loadFavorites();
  }, [tripId]);

  async function toggleFavorite(locationId: number) {
    if (!tripId) return;

    const isFav = favoriteIds.includes(locationId);

    if (!isFav) {
      const { error } = await supabase.from("favorites").insert({
        trip_id: tripId,
        location_id: locationId,
      });
      if (error) {
        alert("お気に入り追加に失敗：" + error.message);
        return;
      }

      setFavoriteIds((prev) => [...prev, locationId]);
    } else {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("trip_id", tripId)
        .eq("location_id", locationId);

      if (error) {
        alert("お気に入り削除に失敗：" + error.message);
        return;
      }

      setFavoriteIds((prev) => prev.filter((id) => id !== locationId));
    }
  }

  function removeFavoriteLocally(locationId: number) {
    setFavoriteIds((prev) => prev.filter((id) => id !== locationId));
  }

  return {
    favoriteIds,
    toggleFavorite,
    removeFavoriteLocally,
  };
}

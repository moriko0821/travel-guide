import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export function useTrip() {
  const [tripId, setTripId] = useState<string | null>(null);
  const [tripName, setTripName] = useState<string>("");
  const [tripNameLoading, setTripNameLoading] = useState(false);
  const [tripNameError, setTripNameError] = useState<string | null>(null);

  const initTripRef = useRef(false);

  useEffect(() => {
    if (initTripRef.current) return;
    initTripRef.current = true;

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

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) return;

    const params = new URLSearchParams(location.search);
    const tripInUrl = params.get("trip");

    if (tripInUrl !== tripId) {
      params.set("trip", tripId);
      navigate(
        { pathname: location.pathname, search: `?${params.toString()}` },
        { replace: true }
      );
    }
  }, [tripId, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!tripId) return;

    const loadTripName = async () => {
      setTripNameLoading(true);
      setTripNameError(null);

      const { data, error } = await supabase
        .from("trips")
        .select("name")
        .eq("id", tripId)
        .single();

      if (error) {
        console.error("Trip name load error:", error);
        setTripNameError("trip名の読み込みに失敗しました");
        setTripNameLoading(false);
        return;
      }

      setTripName(data?.name ?? "");
      setTripNameLoading(false);
    };

    loadTripName();
  }, [tripId]);

  const updateTripName = async (newName: string) => {
    if (!tripId) throw new Error("tripIdがありません");

    const trimmed = newName.trim();
    if (!trimmed) throw new Error("trip名が空です");

    const { error } = await supabase
      .from("trips")
      .update({ name: trimmed })
      .eq("id", tripId)
      .select("id, name")
      .single();

    if (error) throw new Error(error.message);

    setTripName(trimmed);
  };

  return {
    tripId,
    tripName,
    tripNameLoading,
    tripNameError,
    updateTripName,
  };
}

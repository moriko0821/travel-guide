import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState, useEffect } from "react";
import type { Location } from "../data/locations";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 34.052235,
  lng: -118.243683,
};

const LIBRARIES: "places"[] = ["places"];

type MapProps = {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location) => void;
};

export default function Map({
  locations,
  selectedLocation,
  onSelectLocation,
}: MapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: LIBRARIES,
  });

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleLocateMe = () => {
    if (!map) return;

    if (!("geolocation" in navigator)) {
      alert("このブラウザでは現在地情報が利用できません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setUserLocation({ lat: latitude, lng: longitude });
        map.panTo({ lat: latitude, lng: longitude });
        map.setZoom(13);
      },
      (error) => {
        console.error(error);
        alert(
          "現在地を取得できませんでした。位置情報の強化を確認してください。"
        );
      }
    );
  };

  useEffect(() => {
    if (!map || !selectedLocation) return;

    map.panTo({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });

    map.setZoom(12);
  }, [map, selectedLocation]);

  useEffect(() => {
    if (!map || locations.length === 0) return;

    if (selectedLocation) return;

    if (locations.length === 1) {
      const only = locations[0];
      map.panTo({ lat: only.lat, lng: only.lng });
      map.setZoom(12);
      return;
    }

    const bounds = new google.maps.LatLngBounds();

    locations.forEach((loc) => {
      bounds.extend({ lat: loc.lat, lng: loc.lng });
    });

    map.fitBounds(bounds);
  }, [map, locations, selectedLocation]);

  if (loadError) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700">
          <div>Google Mapの読み込みに失敗しました。</div>
          <div className="mt-1">
            以下を確認してください。
            <ul className="mt-1 list-disc pl-5 space-y-1">
              <li>VITE_GOOGLE_MAPS_API_KEYが正しいか</li>
              <li>Maps JavaScript API / Places API が有効か</li>
              <li>
                Billing（課金）が有効か、キー制限でドメインがブロックされていないか
              </li>
            </ul>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              className="underline"
              onClick={() => window.location.reload()}
            >
              再読み込み
            </button>
            <span className="text-xs text-red-600 break-words">
              {String(loadError)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="w-full max-w-3xl mx-auto">Loading Map...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {locations.map((loc) => {
          return (
            <Marker
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              title={loc.name}
              onClick={() => onSelectLocation(loc)}
            />
          );
        })}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
            title="現在地"
          />
        )}
      </GoogleMap>
      <button
        type="button"
        onClick={handleLocateMe}
        className="absolute top-3 right-3 z-10 px-4 py-2 text-sm rounded-full bg-white border border-slate-300 shadow-sm hover:bg-yellow-50 active:scale-95"
      >
        📍 現在地へ
      </button>
    </div>
  );
}

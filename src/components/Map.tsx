import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import type { Location } from "../data/locations";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 34.052235,
  lng: -118.243683,
};

type MapProps = {
  locations: Location[];
};

export default function Map({ locations }: MapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return <p className="text-center">Loading Map...</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
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
            />
          );
        })}
      </GoogleMap>
    </div>
  );
}

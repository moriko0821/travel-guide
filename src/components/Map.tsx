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

  if (!isLoaded) {
    return <p className="text-center">Loading Map...</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
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
      </GoogleMap>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2 } from 'lucide-react';

// Fix for default marker icons in Next.js
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

const LiveLocationMap: React.FC<{ height?: string; zoom?: number }> = ({
  height = '300px',
  zoom = 15
}) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to update the map view when location changes
  function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
          timestamp: position.timestamp
        });
        setIsLoading(false);
      },
      (err) => {
        setError(`Unable to retrieve your location: ${err.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Cleanup function to clear the watch when component unmounts
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <Loader2 className="animate-spin h-8 w-8 text-teal-500" />
        <span className="ml-2">Loading map...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Location Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
        <p className="font-bold">Location Not Available</p>
        <p>Could not determine your current location.</p>
      </div>
    );
  }

  const position: [number, number] = [location.lat, location.lng];
  const date = new Date(location.timestamp).toLocaleTimeString();

  return (
    <div style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <ChangeView center={position} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Your Location</p>
              <p>Lat: {location.lat.toFixed(6)}</p>
              <p>Lng: {location.lng.toFixed(6)}</p>
              {location.accuracy && (
                <p>Accuracy: {Math.round(location.accuracy)} meters</p>
              )}
              <p className="text-xs text-gray-500">Updated: {date}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LiveLocationMap;

import React, { useEffect, useRef, useState } from 'react';

export interface FieldGoogleMapProps {
  farmers: Array<any>;
  height?: string;
}

const FieldGoogleMap: React.FC<FieldGoogleMapProps> = ({ farmers, height = '600px' }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<string>('');
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Uganda center coordinates
    const ugandaCenter = { lat: 0.3476, lng: 32.5825 };

    // Load Leaflet and Marker Cluster libraries
    const ensureLibraries = async () => {
      const w = window as any;
      
      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Marker Cluster CSS
      if (!document.getElementById('leaflet-markercluster-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-markercluster-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
        document.head.appendChild(link);
      }

      if (!document.getElementById('leaflet-markercluster-default-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-markercluster-default-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
        document.head.appendChild(link);
      }

      // Load Leaflet JS
      if (!w.L) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      // Load Marker Cluster JS
      if (!w.L || !w.L.markerClusterGroup) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';
          script.async = true;
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      return !!(w.L && w.L.markerClusterGroup);
    };

    ensureLibraries().then((ok) => {
      if (!ok || !mapRef.current) return;

      const L = (window as any).L;
      
      // Extract farm positions with coordinates
      const farmPositions = (farmers || [])
        .filter((f: any) => f.coordinates?.lat && f.coordinates?.lng)
        .map((f: any) => ({
          id: f._id || f.external_id,
          name: f.name || `Farmer ${f.external_id || ''}`,
          lat: f.coordinates.lat,
          lng: f.coordinates.lng,
          email: f.email,
          phone: f.phone,
          address: f.address,
          farmSize: f.farm_size
        }));

      // Initialize map centered on Uganda
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true
      }).setView([ugandaCenter.lat, ugandaCenter.lng], 7);

      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      // Create marker cluster group
      const markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 50
      });

      markersRef.current = markers;

      // Add markers for each farm
      farmPositions.forEach((farm: any) => {
        const marker = L.marker([farm.lat, farm.lng], {
          title: farm.name
        });

        // Create popup content focused on farm details
        // Generate farm name (e.g., "James Buay's Farm" or "Luweero Farm")
        const farmName = farm.name ? `${farm.name}'s Farm` : (farm.address ? `${farm.address} Farm` : 'Farm Location');
        
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 220px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px; margin: -12px -12px 12px -12px; border-radius: 8px 8px 0 0;">
              <h3 style="margin: 0; font-size: 17px; font-weight: bold;">🌾 ${farmName}</h3>
            </div>
            ${farm.address ? `<p style="margin: 8px 0 12px 0; font-size: 13px; color: #6b7280;"><strong>📍 Location:</strong> ${farm.address}</p>` : ''}
            ${farm.farmSize ? `
              <div style="background: #f0fdf4; padding: 8px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #10b981;">
                <p style="margin: 0; font-size: 14px; color: #065f46;"><strong>🏞️ Farm Size:</strong> ${farm.farmSize} acres</p>
              </div>
            ` : ''}
            ${farm.name ? `<p style="margin: 6px 0; font-size: 13px; color: #6b7280;"><strong>👤 Owner:</strong> ${farm.name}</p>` : ''}
            ${farm.phone ? `<p style="margin: 6px 0; font-size: 13px; color: #6b7280;"><strong>📞 Contact:</strong> ${farm.phone}</p>` : ''}
            <div style="background: #f9fafb; padding: 8px; border-radius: 6px; margin-top: 8px;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                <strong>GPS Coordinates:</strong><br/>
                Lat: ${farm.lat.toFixed(6)}, Lng: ${farm.lng.toFixed(6)}
              </p>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        
        // Store reference for dropdown selection
        (marker as any).farmId = farm.id;
        (marker as any).farmName = farm.name;
        
        markers.addLayer(marker);
      });

      map.addLayer(markers);

      // Auto-fit bounds if we have farms with coordinates
      if (farmPositions.length > 0) {
        const bounds = L.latLngBounds(farmPositions.map((f: any) => [f.lat, f.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }

      // Handle dropdown selection
      if (selectRef.current) {
        selectRef.current.addEventListener('change', (e: any) => {
          const selectedName = e.target.value;
          if (!selectedName) return;

          const farm = farmPositions.find((f: any) => f.name === selectedName);
          if (farm) {
            map.setView([farm.lat, farm.lng], 15);
            
            // Find and open the marker popup
            markers.eachLayer((layer: any) => {
              if (layer.farmName === selectedName) {
                layer.openPopup();
              }
            });
          }
        });
      }

    }).catch((err) => {
      console.error('Failed to load map libraries:', err);
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div style="height:${height};display:flex;align-items:center;justify-content:center;background:#fee2e2;border-radius:12px;border:1px solid #fca5a5;color:#991b1b;font-size:14px;padding:16px;text-align:center;">
            <div>
              <div style="font-weight: bold; margin-bottom: 8px;">⚠️ Map Loading Failed</div>
              <div style="font-size: 12px;">Unable to load map libraries. Please check your internet connection.</div>
            </div>
          </div>
        `;
      }
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [farmers, height]);

  // Extract farm names for dropdown
  const farmNames = (farmers || [])
    .filter((f: any) => f.coordinates?.lat && f.coordinates?.lng && f.name)
    .map((f: any) => f.name);

  return (
    <div style={{ position: 'relative', height }}>
      {/* Farm Selector Dropdown */}
      {farmNames.length > 0 && (
        <select
          ref={selectRef}
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 500,
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '200px'
          }}
          className="hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200"
        >
          <option value="">🗺️ Select Farm Location</option>
          {farmNames.map((name: string, idx: number) => (
            <option key={idx} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '12px',
          overflow: 'hidden'
        }} 
      />

      {/* No Farms Message */}
      {farmNames.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 999,
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '90%'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📍</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
            No Farm Locations Yet
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            Register farmers with coordinates using the "Add Location" feature to see them on the map.
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldGoogleMap;

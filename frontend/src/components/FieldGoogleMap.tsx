import React from 'react';

// Small loader for Google Maps JS API
function useGoogleMaps(apiKey?: string) {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  React.useEffect(() => {
    if ((window as any).google && (window as any).google.maps) {
      setLoaded(true);
      return;
    }
    if (!apiKey) {
      // No API key; we will still render a graceful fallback (Leaflet)
      return;
    }
    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      const check = setInterval(() => {
        if ((window as any).google && (window as any).google.maps) {
          setLoaded(true);
          clearInterval(check);
        }
      }, 200);
      return () => clearInterval(check);
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
  }, [apiKey]);
  return loaded;
}

export interface FieldGoogleMapProps {
  farmers: Array<any>;
  height?: string;
}

const FieldGoogleMap: React.FC<FieldGoogleMapProps> = ({ farmers, height = '320px' }) => {
  const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const loaded = useGoogleMaps(apiKey);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const g = (window as any).google;

    // Default center if no farmer has coords (Lahore-ish)
    const defaultCenter = { lat: 31.5204, lng: 74.3587 };
    // Derive marker positions; if farmer has coordinates, use them; otherwise create deterministic ones
    const positions = (farmers || []).map((f: any, idx: number) => {
      const lat = typeof f.lat === 'number' ? f.lat : (defaultCenter.lat + (idx * 0.05) % 1 - 0.5);
      const lng = typeof f.lng === 'number' ? f.lng : (defaultCenter.lng + (idx * 0.07) % 1 - 0.5);
      return { lat, lng, title: f.name || `Farmer ${idx + 1}`, id: String(f._id || idx) };
    });

    // If Google Maps is available and loaded, render Google Map
    if (g && g.maps) {
      const map = new g.maps.Map(ref.current, {
        center: positions[0] ? { lat: positions[0].lat, lng: positions[0].lng } : defaultCenter,
        zoom: positions.length > 1 ? 8 : 10,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      positions.forEach((p) => {
        const marker = new g.maps.Marker({ position: { lat: p.lat, lng: p.lng }, map, title: p.title });
        const info = new g.maps.InfoWindow({ content: `<div style=\"font-size:12px;color:#111827;\">${p.title}</div>` });
        marker.addListener('click', () => info.open({ anchor: marker, map }));
      });
      return;
    }

    // Otherwise, load Leaflet (no API key required) and render an OSM map
    const ensureLeaflet = async () => {
      const w = window as any;
      if (w.L) return true;

      // Load CSS
      const cssId = 'leaflet-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      // Load JS
      const jsId = 'leaflet-js';
      if (!document.getElementById(jsId)) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.id = jsId;
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }
      return !!(w as any).L;
    };

    ensureLeaflet().then((ok) => {
      const w = window as any;
      if (!ok || !w.L || !ref.current) {
        if (ref.current) {
          ref.current.innerHTML = `<div style=\"height:${height};display:flex;align-items:center;justify-content:center;background:#eef2ff;border-radius:12px;border:1px solid #e5e7eb;color:#374151;font-size:13px;padding:12px;text-align:center;\">Map libraries could not be loaded.</div>`;
        }
        return;
      }
      const L = w.L;
      const map = L.map(ref.current).setView(positions[0] ? [positions[0].lat, positions[0].lng] : [defaultCenter.lat, defaultCenter.lng], positions.length > 1 ? 8 : 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
      positions.forEach((p) => {
        L.marker([p.lat, p.lng]).addTo(map).bindPopup(`<div style=\"font-size:12px;color:#111827;\">${p.title}</div>`);
      });
    });
  }, [loaded, farmers, height]);

  return (
    <div className="rounded-lg overflow-hidden border" style={{ height }}>
      <div ref={ref} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default FieldGoogleMap;

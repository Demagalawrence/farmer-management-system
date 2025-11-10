import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { farmerService } from '../services/farmerService';

interface AddLocationModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: (locationData: any) => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ show, onClose, onSuccess }) => {
  const [locationForm, setLocationForm] = useState({
    farmName: '',
    farmerId: '',
    fieldSize: '',
    region: '',
    village: '',
    latitude: '',
    longitude: '',
    soilType: '',
    topography: 'flat',
    irrigationAvailable: false,
    irrigationType: '',
    waterSource: '',
    drainageQuality: 'good'
  });
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Load farmers on mount
  useEffect(() => {
    if (show) {
      loadFarmers();
    }
  }, [show]);

  const loadFarmers = async () => {
    try {
      setLoadingFarmers(true);
      const response = await farmerService.getAllFarmers();
      const farmersList = Array.isArray(response) ? response : (response?.data || response?.items || []);
      setFarmers(farmersList);
    } catch (err) {
      console.error('Failed to load farmers:', err);
    } finally {
      setLoadingFarmers(false);
    }
  };

  useEffect(() => {
    if (!show || !mapContainerRef.current) return;

    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      // Check if Leaflet is already loaded
      if ((window as any).L) {
        initializeMap();
        return;
      }

      // Load Leaflet CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const L = (window as any).L;
      if (!L || mapRef.current) return;

      // Center map over Uganda
      const map = L.map(mapContainerRef.current).setView([0.3476, 32.5825], 8);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;

      // Handle map clicks
      map.on('click', (e: any) => {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = L.marker(e.latlng, { draggable: true }).addTo(map);
          
          // Handle marker drag
          markerRef.current.on('dragend', function(event: any) {
            const position = event.target.getLatLng();
            setLocationForm(prev => ({
              ...prev,
              latitude: position.lat.toFixed(6),
              longitude: position.lng.toFixed(6)
            }));
          });
        }

        // Update form
        setLocationForm(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng
        }));
      });
    };

    loadLeaflet();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate coordinates
    if (!locationForm.latitude || !locationForm.longitude) {
      setError('Please select a location on the map by clicking it');
      return;
    }

    try {
      // Call the parent's success handler
      await onSuccess({
        field_name: locationForm.farmName,
        farmer_id: locationForm.farmerId,
        size_hectares: parseFloat(locationForm.fieldSize),
        region: locationForm.region,
        village: locationForm.village,
        latitude: parseFloat(locationForm.latitude),
        longitude: parseFloat(locationForm.longitude),
        coordinates: {
          lat: parseFloat(locationForm.latitude),
          lng: parseFloat(locationForm.longitude)
        },
        soil_type: locationForm.soilType || null,
        topography: locationForm.topography,
        irrigation_available: locationForm.irrigationAvailable,
        irrigation_type: locationForm.irrigationType || null,
        water_source: locationForm.waterSource || null,
        drainage_quality: locationForm.drainageQuality
      });

      setSuccess('✅ Field registered successfully!');
      
      // Reset form
      setTimeout(() => {
        setLocationForm({
          farmName: '',
          farmerId: '',
          fieldSize: '',
          region: '',
          village: '',
          latitude: '',
          longitude: '',
          soilType: '',
          topography: 'flat',
          irrigationAvailable: false,
          irrigationType: '',
          waterSource: '',
          drainageQuality: 'good'
        });
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to add farm location');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-800">📍 Register Field</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.farmName}
                  onChange={(e) => setLocationForm({ ...locationForm, farmName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., North Plot, Upper Farm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner (Farmer) *
                </label>
                <select
                  required
                  value={locationForm.farmerId}
                  onChange={(e) => setLocationForm({ ...locationForm, farmerId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loadingFarmers}
                >
                  <option value="">
                    {loadingFarmers ? 'Loading farmers...' : 'Select farmer'}
                  </option>
                  {farmers.map((farmer) => (
                    <option key={farmer._id} value={farmer._id}>
                      {farmer.name || farmer.full_name || `Farmer ${farmer._id}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the farmer who owns this field</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Size (hectares) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={locationForm.fieldSize}
                  onChange={(e) => setLocationForm({ ...locationForm, fieldSize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 5.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region / District *
                </label>
                <input
                  type="text"
                  required
                  value={locationForm.region}
                  onChange={(e) => setLocationForm({ ...locationForm, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Mukono District"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village / Landmark
                </label>
                <input
                  type="text"
                  value={locationForm.village}
                  onChange={(e) => setLocationForm({ ...locationForm, village: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Near Nakawa Market"
                />
              </div>
            </div>
          </div>

          {/* Soil & Terrain */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Soil & Terrain (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soil Type
                </label>
                <select
                  value={locationForm.soilType}
                  onChange={(e) => setLocationForm({ ...locationForm, soilType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select soil type</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loam">Loam</option>
                  <option value="clay_loam">Clay Loam</option>
                  <option value="sandy_loam">Sandy Loam</option>
                  <option value="silt">Silt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topography
                </label>
                <select
                  value={locationForm.topography}
                  onChange={(e) => setLocationForm({ ...locationForm, topography: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="flat">Flat</option>
                  <option value="sloped">Sloped</option>
                  <option value="hilly">Hilly</option>
                  <option value="valley">Valley</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drainage Quality
                </label>
                <select
                  value={locationForm.drainageQuality}
                  onChange={(e) => setLocationForm({ ...locationForm, drainageQuality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor (Waterlogging)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Water & Irrigation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Water & Irrigation (Optional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={locationForm.irrigationAvailable}
                    onChange={(e) => setLocationForm({ ...locationForm, irrigationAvailable: e.target.checked })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Irrigation Available</span>
                </label>
              </div>

              {locationForm.irrigationAvailable && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Irrigation Type
                    </label>
                    <select
                      value={locationForm.irrigationType}
                      onChange={(e) => setLocationForm({ ...locationForm, irrigationType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      <option value="drip">Drip</option>
                      <option value="sprinkler">Sprinkler</option>
                      <option value="flood">Flood</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Water Source
                    </label>
                    <select
                      value={locationForm.waterSource}
                      onChange={(e) => setLocationForm({ ...locationForm, waterSource: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Select source</option>
                      <option value="borehole">Borehole</option>
                      <option value="river">River/Stream</option>
                      <option value="well">Well</option>
                      <option value="rain_fed">Rain-fed</option>
                      <option value="reservoir">Reservoir</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Farm Location on Map *
            </label>
            <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
              <div 
                ref={mapContainerRef}
                id="mapPicker" 
                style={{ height: '400px', width: '100%' }}
                className="relative"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Click on the map to drop a pin at the farm location. You can drag the pin to adjust.
            </p>
          </div>

          {/* Coordinate Display */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                readOnly
                value={locationForm.latitude}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Auto-filled"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                readOnly
                value={locationForm.longitude}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Auto-filled"
              />
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Register Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;

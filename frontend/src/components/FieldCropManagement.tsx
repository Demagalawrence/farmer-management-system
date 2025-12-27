import React from 'react';
import { MapPin, AlertCircle, Package, TrendingUp, Calendar } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  status: 'optimal' | 'warning' | 'critical';
  crop: string;
  health: number;
  soilMoisture: number;
  lastInspection: string;
}

interface FieldCropManagementProps {
  fields: Field[];
  inputInventory: Array<{ name: string; quantity: number; reorderPoint: number; unit: string }>;
  yieldProjections: Array<{ crop: string; expected: number; actual: number }>;
}

export const FieldCropManagement: React.FC<FieldCropManagementProps> = ({
  fields,
  inputInventory,
  yieldProjections
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const lowStockItems = inputInventory.filter(item => item.quantity <= item.reorderPoint);

  return (
    <div className="space-y-6">
      {/* Field Health Map */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-green-600" />
          Field Health Map
        </h2>
        
        {/* Interactive Map Placeholder */}
        <div className="relative h-80 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200 mb-4">
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md">
            <div className="text-xs space-y-1">
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div><span>Optimal</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div><span>Warning</span></div>
              <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div><span>Critical</span></div>
            </div>
          </div>
          
          {/* Field Markers */}
          {fields.map((field, idx) => {
            const left = 15 + (idx * 18) % 70;
            const top = 20 + (idx * 15) % 60;
            return (
              <div
                key={field.id}
                className={`group absolute w-6 h-6 rounded-full ${getStatusColor(field.status)} border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-125`}
                style={{ left: `${left}%`, top: `${top}%` }}
                title={`${field.name} - ${field.crop}`}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-20 left-1/2 -translate-x-1/2 bg-white text-gray-700 text-xs px-3 py-2 rounded shadow-lg w-48 z-10">
                  <div className="font-bold">{field.name}</div>
                  <div className="text-gray-600">Crop: {field.crop}</div>
                  <div className="text-gray-600">Health: {field.health}%</div>
                  <div className="text-gray-600">Soil Moistures: {field.soilMoisture}%</div>
                  <div className="text-gray-500 text-xs mt-1">Last: {field.lastInspection}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Field Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fields.slice(0, 6).map(field => (
            <div key={field.id} className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-800">{field.name}</div>
                  <div className="text-sm text-gray-600">{field.crop}</div>
                </div>
                <span className={`w-3 h-3 rounded-full ${getStatusColor(field.status)}`}></span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Health:</span>
                  <span className="font-medium">{field.health}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Soil Moisture:</span>
                  <span className="font-medium">{field.soilMoisture}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Inventory & Yield Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Inventory */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Input Inventory
          </h3>
          {lowStockItems.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-800 font-semibold text-sm mb-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                Low Stock Alerts ({lowStockItems.length})
              </div>
              <div className="space-y-1">
                {lowStockItems.map((item, idx) => (
                  <div key={idx} className="text-xs text-red-700">
                    • {item.name}: {item.quantity} {item.unit} remaining
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            {inputInventory.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                <div className="text-right">
                  <span className={`text-sm font-bold ${item.quantity <= item.reorderPoint ? 'text-red-600' : 'text-green-600'}`}>
                    {item.quantity} {item.unit}
                  </span>
                  <div className="text-xs text-gray-500">Reorder: {item.reorderPoint}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Yield Projections */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Yield Projections
          </h3>
          <div className="space-y-4">
            {yieldProjections.map((proj, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{proj.crop}</span>
                  <span className="text-sm text-gray-600">
                    {((proj.actual / proj.expected) * 100).toFixed(0)}% of target
                  </span>
                </div>
                <div className="flex space-x-2 text-xs">
                  <div className="flex-1 bg-gray-200 rounded-full h-6 flex items-center px-2 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-blue-400 rounded-full"
                      style={{width: `${Math.min((proj.expected / Math.max(proj.expected, proj.actual)) * 100, 100)}%`}}
                    ></div>
                    <span className="relative z-10 text-gray-700 font-medium">Expected: {proj.expected}T</span>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 flex items-center px-2 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-full"
                      style={{width: `${Math.min((proj.actual / Math.max(proj.expected, proj.actual)) * 100, 100)}%`}}
                    ></div>
                    <span className="relative z-10 text-gray-700 font-medium">Actual: {proj.actual}T</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline/Rotation Planner */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
          Crop Rotation Timeline
        </h3>
        <div className="space-y-3">
          {fields.slice(0, 4).map(field => (
            <div key={field.id} className="flex items-center space-x-4">
              <div className="w-32 text-sm font-medium text-gray-700">{field.name}</div>
              <div className="flex-1 h-8 bg-gray-100 rounded-lg relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-green-400 w-2/3 flex items-center px-3 text-xs font-medium text-white">
                  {field.crop} (Current)
                </div>
                <div className="absolute right-0 top-0 bottom-0 bg-gray-300 w-1/3 flex items-center justify-center text-xs text-gray-600">
                  Next Rotation
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

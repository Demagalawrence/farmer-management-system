import React, { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Settings, Bell, User, Sun, Cloud, Droplets, Wind, Leaf, TrendingUp, BarChart3, Activity, CheckSquare, MapPin } from 'lucide-react';
import { useWallpaper } from '../contexts/WallpaperContext';
import { useAuth } from '../contexts/AuthContext';
import WallpaperGallery from './WallpaperGallery';

const DarkModeDashboard: React.FC = () => {
  const { currentWallpaper, setWallpaper } = useWallpaper();
  const { logout } = useAuth();
  const [showWallpaperGallery, setShowWallpaperGallery] = useState(false);

  // Weather data
  const weatherData = [
    { time: '5:22 am', temp: 27, icon: '🌙' },
    { time: '6:41 pm', temp: 27, icon: '☀️' }
  ];

  // Soil moisture data
  const soilMoistureData = [
    { name: 'Low', value: 30, color: '#8B5CF6' },
    { name: 'Optimal', value: 45, color: '#10B981' },
    { name: 'High', value: 25, color: '#3B82F6' }
  ];

  // Sustainability data
  const sustainabilityData = [
    { name: 'Used', value: 45, color: '#F59E0B' },
    { name: 'Available', value: 55, color: '#10B981' }
  ];

  // Expense/Income chart data
  const financeData = [
    { month: 'Jan', expense: 200, income: 180 },
    { month: 'Feb', expense: 220, income: 200 },
    { month: 'Mar', expense: 180, income: 220 },
    { month: 'Apr', expense: 250, income: 240 },
    { month: 'May', expense: 200, income: 260 },
    { month: 'Jun', expense: 180, income: 220 },
    { month: 'Jul', expense: 220, income: 200 },
    { month: 'Aug', expense: 240, income: 280 },
    { month: 'Sep', expense: 200, income: 250 },
    { month: 'Oct', expense: 180, income: 240 },
    { month: 'Nov', expense: 220, income: 260 },
    { month: 'Dec', expense: 200, income: 280 }
  ];

  // Crop production data
  const cropProductionData = [
    { year: '2014-15', barley: 60, corn: 40, potato: 30 },
    { year: '2015-16', barley: 70, corn: 50, potato: 35 },
    { year: '2016-17', barley: 65, corn: 60, potato: 40 },
    { year: '2017-18', barley: 80, corn: 70, potato: 45 },
    { year: '2018-19', barley: 75, corn: 65, potato: 50 },
    { year: '2019-20', barley: 90, corn: 80, potato: 55 },
    { year: '2020-21', barley: 85, corn: 75, potato: 60 },
    { year: '2021-22', barley: 95, corn: 85, potato: 65 },
    { year: '2022-23', barley: 100, corn: 90, potato: 70 }
  ];

  // Logistics data
  const logisticsData = [
    { id: '038', shipmentId: '#260056', product: 'Barley', status: 'Arrived', statusColor: '#10B981' },
    { id: '568', shipmentId: '#260759', product: 'Corn', status: 'Pending', statusColor: '#F59E0B' },
    { id: '234', shipmentId: '#067458', product: 'Corn', status: 'Delivered', statusColor: '#10B981' },
    { id: '101', shipmentId: '#890283', product: 'Wheat', status: 'Arrived', statusColor: '#10B981' }
  ];

  const handleWallpaperSelect = (wallpaper: any) => {
    setWallpaper(wallpaper);
    setShowWallpaperGallery(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Dark Mode Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-400">Dark Mode</h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowWallpaperGallery(true)}
              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              title="Change Wallpaper"
            >
              🎨
            </button>
            <button 
              onClick={logout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-green-400">Green Field</span>
          </div>

          <nav className="space-y-2">
            <div className="flex items-center space-x-3 bg-green-600 text-white px-3 py-3 rounded-lg">
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </div>
            <button className="w-full flex items-center space-x-3 text-gray-300 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <TrendingUp className="w-5 h-5" />
              <span>Farm Revenue</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-300 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Cloud className="w-5 h-5" />
              <span>Weather</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-300 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Droplets className="w-5 h-5" />
              <span>Soil Moisture</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-300 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Leaf className="w-5 h-5" />
              <span>Sustainability</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-300 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <Activity className="w-5 h-5" />
              <span>Crop Yield</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-300 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>Crop Production</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-gray-300 px-3 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              <CheckSquare className="w-5 h-5" />
              <span>Task Management</span>
            </button>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-2 text-gray-400">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Dark Mode</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Top Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-80 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Settings className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <Bell className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              <User className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Top Row - Weather, Soil Moisture, Sustainability, Task Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Weather */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Weather</h3>
                <span className="text-sm text-gray-400">Today ▼</span>
              </div>
              <div className="text-3xl font-bold mb-2">+ 27°C</div>
              <div className="grid grid-cols-4 gap-2 text-xs text-gray-400 mb-4">
                <div className="text-center">
                  <Sun className="w-4 h-4 mx-auto mb-1" />
                  <div>23°C</div>
                  <div>Sun Rise</div>
                </div>
                <div className="text-center">
                  <Droplets className="w-4 h-4 mx-auto mb-1" />
                  <div>76%</div>
                  <div>Humidity</div>
                </div>
                <div className="text-center">
                  <Wind className="w-4 h-4 mx-auto mb-1" />
                  <div>Dawn</div>
                  <div>Wind Speed</div>
                </div>
                <div className="text-center">
                  <Cloud className="w-4 h-4 mx-auto mb-1" />
                  <div>Warm</div>
                  <div>Precipitation</div>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span>5:22 am 🌙 27°C</span>
                <span>6:41 pm ☀️</span>
              </div>
            </div>

            {/* Soil Moisture */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Soil Moisture</h3>
                <span className="text-sm text-gray-400">Daily ▼</span>
              </div>
              <div className="text-sm text-gray-400 mb-4">6 Fields · 24 Pods · 81 Feeds</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-purple-600 rounded p-2 text-center">
                  <div className="text-xs">Low</div>
                </div>
                <div className="bg-green-600 rounded p-2 text-center">
                  <div className="text-xs">Optimal</div>
                </div>
                <div className="bg-blue-600 rounded p-2 text-center">
                  <div className="text-xs">High</div>
                </div>
              </div>
              <div className="h-20 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={soilMoistureData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={40}
                      dataKey="value"
                    >
                      {soilMoistureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sustainability */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Sustainability</h3>
              <div className="text-3xl font-bold mb-2">45%</div>
              <div className="h-20 flex items-center justify-center mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sustainabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={35}
                      dataKey="value"
                    >
                      {sustainabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-gray-400">
                <div>Live Sensors · Predictive · Alerts</div>
                <div className="mt-2">75% · 30% · 45%</div>
              </div>
            </div>

            {/* Task Management */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Task Management</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Scheduled spraying today!</span>
                </div>
                <div className="text-xs text-gray-400">Today field 1</div>
                <div className="flex items-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Field inspection pending</span>
                </div>
                <div className="text-xs text-gray-400">2 days delayed</div>
              </div>
            </div>
          </div>

          {/* Middle Row - Expense/Income Chart and Export Location */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Expense/Income Chart */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Expense</h3>
                  <span className="text-yellow-500">Income</span>
                </div>
                <span className="text-sm text-gray-400">Yearly ▼</span>
              </div>
              <div className="text-2xl font-bold mb-4">$ 268,663</div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={financeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="expense" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="income" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Export Location */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Export Location</h3>
                <span className="text-sm text-gray-400">Weekly ▼</span>
              </div>
              <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* World Map Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-yellow-500/20 to-green-500/20"></div>
                <div className="text-center z-10">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-green-400" />
                  <div className="text-sm text-gray-300">Global Export Map</div>
                </div>
                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Top</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Logistics and Crop Production */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Logistics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Logistics</h3>
                <span className="text-sm text-gray-400">Today ▼</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="text-left py-2">#</th>
                      <th className="text-left py-2">Shipment ID</th>
                      <th className="text-left py-2">Details</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logisticsData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-3">{item.id}</td>
                        <td className="py-3">{item.shipmentId}</td>
                        <td className="py-3">{item.product}</td>
                        <td className="py-3">
                          <span 
                            className="px-2 py-1 rounded text-xs"
                            style={{ backgroundColor: `${item.statusColor}20`, color: item.statusColor }}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Crop Production */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Crop Production</h3>
                <span className="text-sm text-gray-400">Yearly ▼</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cropProductionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="barley" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="corn" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="potato" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Barley</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Corn</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Potato</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallpaper Gallery Modal */}
      <WallpaperGallery
        isOpen={showWallpaperGallery}
        onClose={() => setShowWallpaperGallery(false)}
        onSelectWallpaper={handleWallpaperSelect}
        currentWallpaper={currentWallpaper.id}
      />
    </div>
  );
};

export default DarkModeDashboard;

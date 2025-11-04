import React, { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { useWallpaper } from '../contexts/WallpaperContext';
import { useAuth } from '../contexts/AuthContext';
import WallpaperGallery from './WallpaperGallery';

const FarmerDashboard: React.FC = () => {
  const { currentWallpaper, setWallpaper } = useWallpaper();
  const { user, logout } = useAuth();
  const [showWallpaperGallery, setShowWallpaperGallery] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Land overview data for pie chart
  const landData = [
    { name: 'Covered Land', value: 86, color: '#22c55e' },
    { name: 'Free Land', value: 14, color: '#e5e7eb' }
  ];

  // Cost estimation data
  const costData = [
    { month: 'JAN', profit: 30, cost: 25 },
    { month: 'FEB', profit: 35, cost: 30 },
    { month: 'MAR', profit: 45, cost: 35 },
    { month: 'APR', profit: 40, cost: 32 },
    { month: 'MAY', profit: 50, cost: 38 },
    { month: 'JUN', profit: 48, cost: 40 }
  ];

  // My crops data
  const myCropsData = [
    { name: 'Apple Gourd', status: 'Seed Started', progress: 8, healthColor: '#22c55e' },
    { name: 'Wheat', status: 'Ripening', progress: 32, healthColor: '#eab308' },
    { name: 'Corn', status: 'Vegetation', progress: 86, healthColor: '#dc2626' }
  ];

  const handleWallpaperSelect = (wallpaper: any) => {
    setWallpaper(wallpaper);
    setShowWallpaperGallery(false);
  };

  return (
    <div className={`min-h-screen ${currentWallpaper.background}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FARM MANAGEMENT</span>
                <span className="text-sm text-gray-500">System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              
              {/* Wallpaper Button */}
              <button 
                onClick={() => setShowWallpaperGallery(true)}
                className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors duration-200"
                title="Change Wallpaper"
              >
                <span className="text-lg">🎨</span>
              </button>
              
              
              {/* Settings Button */}
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Notifications Button */}
              <button 
                className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors duration-200 relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              
              {/* User Profile */}
              <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'A'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">{user?.name || 'Albert John'}</span>
                  <div className="text-xs text-gray-500">Farmer, Malawi</div>
                </div>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
                title="Logout"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar and Main Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm">
            <nav className="p-4 space-y-2">
              <div className="flex items-center space-x-3 bg-green-100 text-green-700 px-3 py-3 rounded-lg">
                <span className="text-sm">📊</span>
                <span className="font-medium">Dashboard</span>
              </div>
              <button className="w-full flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-green-600 transition-colors duration-200">
                <span className="text-sm">🚜</span>
                <span>Manage Farm</span>
              </button>
              <button className="w-full flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-orange-600 transition-colors duration-200">
                <span className="text-sm">🏪</span>
                <span>Warehouse</span>
              </button>
              <button className="w-full flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-green-600 transition-colors duration-200">
                <span className="text-sm">🌾</span>
                <span>Lands</span>
              </button>
              <button className="w-full flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200">
                <span className="text-sm">📊</span>
                <span>Reports</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Land Area */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Land Area</p>
                    <p className="text-3xl font-bold text-gray-900">14,000 <span className="text-lg">acres</span></p>
                    <button 
                      onClick={() => alert('Land Details: 14,000 acres total\n- 12,040 acres cultivated\n- 1,960 acres available')}
                      className="text-sm text-blue-600 hover:text-blue-800 mt-2 hover:underline transition-all duration-200"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>

              {/* Estimated Profit */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Estimated Profit</p>
                    <p className="text-3xl font-bold text-gray-900">12,538,4679 <span className="text-lg">pkr</span></p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <p className="text-sm text-green-600">+25.5% from last month</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimated Cost */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Estimated Cost</p>
                    <p className="text-3xl font-bold text-gray-900">12,50,000 <span className="text-lg">pkr</span></p>
                    <div className="flex items-center mt-2">
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      <p className="text-sm text-red-600">-15.0% from last month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-sm p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-90">📍 Islamabad</p>
                  <h2 className="text-2xl font-bold mt-1">Today</h2>
                  <p className="text-sm opacity-90">27 Aug 2024</p>
                  <button className="text-sm underline mt-2 opacity-90">See next forecast details</button>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-4xl">☀️</span>
                    <span className="text-4xl font-bold">30°C</span>
                  </div>
                  <p className="text-sm opacity-90">Cloudy</p>
                </div>
              </div>
            </div>

            {/* Land Overview and Cost Estimation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Land Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Land Overview</h2>
                
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48" style={{ minWidth: '192px', minHeight: '192px' }}>
                    <ResponsiveContainer width={192} height={192}>
                      <PieChart width={192} height={192}>
                        <Pie
                          data={landData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                        >
                          {landData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">86%</p>
                        <p className="text-sm text-gray-600">Land Area</p>
                        <p className="text-sm font-medium">14,000 acres</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">86% Covered Land</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-sm">14% Free Land</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Estimation */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Cost Estimation</h2>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>6 Months Report</option>
                    <option>12 Months Report</option>
                  </select>
                </div>

                <div className="h-64" style={{ minHeight: '256px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height={256} minHeight={256}>
                    <LineChart data={costData} width={400} height={256}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        name="Estimated Profit"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="cost" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="Estimated Cost"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Estimated Profit</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Estimated Cost</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid - My Crops, Warehouse, Machinery, Livestock, Inventory */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* My Crops */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Crops</h2>
                  <button 
                    onClick={() => alert('Opening detailed crops view...')}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-4">
                  {myCropsData.map((crop, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg">🌱</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{crop.name}</span>
                            <span className="text-xs text-gray-500">{crop.progress}%</span>
                          </div>
                          <p className="text-xs text-gray-600">{crop.status}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${crop.progress}%`, 
                                backgroundColor: crop.healthColor 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Warehouse */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Warehouse</h2>
                  <button className="text-sm text-blue-600">View All →</button>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">15</div>
                  <p className="text-sm text-gray-600">Total Warehouses</p>
                  <div className="mt-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl">🏪</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Machinery */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Machinery</h2>
                  <button className="text-sm text-blue-600">View All →</button>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">35</div>
                  <p className="text-sm text-gray-600">Total Machines</p>
                  <div className="mt-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl">🚜</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Livestock */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Livestock</h2>
                  <button className="text-sm text-blue-600">View All →</button>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">305</div>
                  <p className="text-sm text-gray-600">Total Animals</p>
                  <div className="mt-4">
                    <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl">🐄</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Inventory */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Inventory</h2>
                  <button className="text-sm text-blue-600">View All →</button>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">8762</div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <div className="mt-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                  </div>
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Preference
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                  <option>Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>English</option>
                  <option>Urdu</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notifications</span>
                <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                  Enabled
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;

import React, { useState } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, MapPin, Edit } from 'lucide-react';

const FieldOfficerDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Crop category data for pie chart
  const cropCategoryData = [
    { name: 'Fruits', value: 20, color: '#FFA500', count: 14600 },
    { name: 'Vegetables', value: 38, color: '#90EE90', count: 2700 },
    { name: 'Grains', value: 33, color: '#228B22', count: 364500 }
  ];

  // Crop growth monitoring data
  const cropGrowthData = [
    { date: 'Mon 30', openSoil: 20, low: 35, ideal: 45, high: 25, cloud: 15 },
    { date: 'Tue 31', openSoil: 25, low: 30, ideal: 50, high: 30, cloud: 20 },
    { date: 'Wed 33', openSoil: 15, low: 40, ideal: 55, high: 35, cloud: 25 },
    { date: 'Thu 33', openSoil: 30, low: 25, ideal: 40, high: 40, cloud: 30 },
    { date: 'Fri 34', openSoil: 20, low: 45, ideal: 60, high: 20, cloud: 15 },
    { date: 'Sat 35', openSoil: 35, low: 35, ideal: 45, high: 45, cloud: 35 },
    { date: 'Sun 36', openSoil: 25, low: 50, ideal: 65, high: 30, cloud: 20 },
    { date: 'Mon 37', openSoil: 40, low: 30, ideal: 50, high: 35, cloud: 25 },
    { date: 'Tue 38', openSoil: 30, low: 55, ideal: 70, high: 25, cloud: 30 }
  ];

  // My crops data with health indicators
  const myCropsData = [
    { name: 'Barley', progress: 90, color: '#90EE90', status: 'Excellent' },
    { name: 'Millet', progress: 65, color: '#90EE90', status: 'Sprouting' },
    { name: 'Corn', progress: 25, color: '#DEB887', status: 'Planted' },
    { name: 'Oats', progress: 70, color: '#FFD700', status: 'Sprouting' },
    { name: 'Rice', progress: 10, color: '#FFA500', status: 'Planted' },
    { name: 'Wheat', progress: 100, color: '#8B4513', status: 'Harvest' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">🌾</span>
                </div>
                <span className="text-xl font-bold text-gray-900">FARMER MANAGEMENT.</span>
                <span className="text-sm text-gray-500">System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-lg">
                <span className="text-lg">☀️</span>
                <span className="text-sm font-medium">24°C</span>
                <span className="text-xs text-gray-600">Today is partly sunny day!</span>
              </div>
              <button className="p-2 bg-gray-100 rounded-lg">
                <span className="text-lg">🔔</span>
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar and Main Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              <div className="flex items-center space-x-3 bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                <span className="text-sm">📊</span>
                <span className="font-medium">Dashboards</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="text-sm">🌱</span>
                <span>Add Crops</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50">
                <MapPin className="w-4 h-4" />
                <span>Add Location</span>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search crop here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Crops Overview and Farm Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Crops Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Crops Overview</h2>
                
                {/* Category/Health Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                  <button className="flex-1 py-2 px-4 bg-white rounded-md shadow-sm text-sm font-medium">
                    By Category
                  </button>
                  <button className="flex-1 py-2 px-4 text-sm font-medium text-gray-600">
                    By Health
                  </button>
                </div>

                {/* Pie Chart */}
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cropCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {cropCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-2">
                  {cropCategoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{item.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Farm Image */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="relative h-64 bg-green-200 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500"></div>
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Malakwal Farm</span>
                      <Edit className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Crop Health</span>
                        <span className="text-gray-600">Sowing Date</span>
                        <span className="text-gray-600">Harvest Date</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-green-600">Good</span>
                        <span>Feb 21, 2024</span>
                        <span>Apr 25, 2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Crop Growth Monitoring and My Crops */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Crop Growth Monitoring */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Crop Growth Monitoring</h2>
                  <div className="flex space-x-2">
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Crop Moisture</option>
                    </select>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option>Select Crop</option>
                    </select>
                  </div>
                </div>

                {/* Monitoring Categories */}
                <div className="flex justify-between mb-4 text-xs">
                  <div className="text-center">
                    <div className="text-red-500 font-medium">0.3 Acres</div>
                    <div className="text-gray-600">Open Soil</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-500 font-medium">0.7 Acres</div>
                    <div className="text-gray-600">Low</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-500 font-medium">0.5 Acres</div>
                    <div className="text-gray-600">Ideal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-500 font-medium">0.1 Acres</div>
                    <div className="text-gray-600">High</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 font-medium">0.1 Acres</div>
                    <div className="text-gray-600">Cloud</div>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cropGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="openSoil" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="low" stroke="#f97316" strokeWidth={2} />
                      <Line type="monotone" dataKey="ideal" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="high" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="cloud" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* My Crops */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">My Crops</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                </div>

                <div className="space-y-4">
                  {myCropsData.map((crop, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm">🌾</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{crop.name}</span>
                            <span className="text-xs text-gray-500">{crop.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${crop.progress}%`, 
                                backgroundColor: crop.color 
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{crop.status}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldOfficerDashboard;

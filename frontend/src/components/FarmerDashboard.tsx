import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Settings, Bell, TrendingUp, TrendingDown } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
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
                <span className="text-xl font-bold text-gray-900">FARMER MANAGEMENT</span>
                <span className="text-sm text-gray-500">System</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <button className="p-2 bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <span className="text-sm font-medium">Albert John</span>
                  <div className="text-xs text-gray-500">Farmer, Malawi</div>
                </div>
              </div>
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
              <div className="flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm">🚜</span>
                <span>Manage Farm</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm">🏪</span>
                <span>Warehouse</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm">🌾</span>
                <span>Lands</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600 px-3 py-3 rounded-lg hover:bg-gray-50">
                <span className="text-sm">📊</span>
                <span>Reports</span>
              </div>
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
                    <button className="text-sm text-blue-600 hover:text-blue-800 mt-2">View Details →</button>
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
                  <button className="text-sm underline mt-2 opacity-90">See next forecast detail</button>
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
                <h2 className="text-xl font-semibold mb-4">Land Overviews</h2>
                
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
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

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costData}>
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
                  <button className="text-sm text-blue-600 hover:text-blue-800">View All →</button>
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
    </div>
  );
};

export default FarmerDashboard;
                  <span className="text-lg">📊</span>
                </div>
                <span className="font-bold text-lg">Dashboard</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-6 py-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer card-hover">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🚜</span>
                </div>
                <span className="font-semibold">Manage Farm</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-6 py-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer card-hover">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-yellow-200 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🏪</span>
                </div>
                <span className="font-semibold">Warehouse</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-6 py-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer card-hover">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-lime-200 rounded-xl flex items-center justify-center">
                  <span className="text-lg">🌾</span>
                </div>
                <span className="font-semibold">Lands</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-6 py-4 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-500 cursor-pointer card-hover">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
                <span className="font-semibold">Reports</span>
              </div>
            </nav>
            
            {/* Quick Stats in Sidebar */}
            <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl">
              <h4 className="font-bold text-emerald-800 mb-4">📈 Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Active Fields</span>
                  <span className="font-bold text-emerald-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Harvest Ready</span>
                  <span className="font-bold text-emerald-900">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Weather Score</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Enhanced Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slideInRight">
              {/* Total Land Area */}
              <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl shadow-2xl p-8 text-white card-hover animate-float">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <div className="w-4 h-4 bg-white bg-opacity-30 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-emerald-100 font-medium mb-2">Total Land Area</p>
                  <p className="text-4xl font-bold mb-3">14,000 <span className="text-2xl">acres</span></p>
                  <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-xl hover:bg-opacity-30 transition-all duration-300 font-semibold">
                    View Details →
                  </button>
                </div>
              </div>

              {/* Estimated Profit */}
              <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-8 text-white card-hover animate-float" style={{animationDelay: '0.2s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">💰</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-200 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-green-100 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
                <div>
                  <p className="text-green-100 font-medium mb-2">Estimated Profit</p>
                  <p className="text-4xl font-bold mb-3">₨12.5M</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📈</span>
                    <p className="text-green-200 font-semibold">+25.5% from last month</p>
                  </div>
                </div>
              </div>

              {/* Estimated Cost */}
              <div className="bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 rounded-3xl shadow-2xl p-8 text-white card-hover animate-float" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">💸</span>
                  </div>
                  <div className="w-4 h-4 bg-orange-300 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <p className="text-orange-100 font-medium mb-2">Estimated Cost</p>
                  <p className="text-4xl font-bold mb-3">₨12.5M</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📉</span>
                    <p className="text-orange-200 font-semibold">-15.0% from last month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Weather Widget */}
            <div className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-white card-hover animate-slideInLeft overflow-hidden relative">
              {/* Animated background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16 animate-float"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12 animate-float" style={{animationDelay: '1s'}}></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="animate-slideInLeft">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-2xl">📍</span>
                      <p className="text-blue-100 font-semibold text-lg">Islamabad</p>
                    </div>
                    <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Today
                    </h2>
                    <p className="text-blue-200 font-medium">27 Aug 2024</p>
                    <button className="mt-4 bg-white bg-opacity-20 px-6 py-3 rounded-2xl hover:bg-opacity-30 transition-all duration-300 font-semibold backdrop-blur-sm">
                      📊 See Forecast Details
                    </button>
                  </div>
                  <div className="text-right animate-slideInRight">
                    <div className="flex items-center justify-end space-x-4 mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl flex items-center justify-center shadow-2xl animate-float">
                        <Sun className="w-12 h-12 text-white" />
                      </div>
                      <span className="text-6xl font-bold bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent">
                        30°C
                      </span>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                      <p className="text-blue-200 font-semibold text-lg">Partly Cloudy</p>
                    </div>
                    
                    {/* Weather details */}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                      <div className="bg-white bg-opacity-15 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-2xl mb-1">💧</div>
                        <div className="text-xs text-blue-200">Humidity</div>
                        <div className="font-bold">65%</div>
                      </div>
                      <div className="bg-white bg-opacity-15 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-2xl mb-1">🌪️</div>
                        <div className="text-xs text-blue-200">Wind</div>
                        <div className="font-bold">12 km/h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Land Overview and Cost Estimation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Land Overview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Land Overview</h2>
                
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
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

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={costData}>
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
                  <button className="text-sm text-blue-600 hover:text-blue-800">View All →</button>
                </div>

                <div className="space-y-4">
                  {myCropsData.map((crop, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{crop.name}</span>
                            <span className="text-xs text-gray-500">{crop.progress}%</span>
                          </div>
                          <p className="text-xs text-gray-600">{crop.status}</p>
                          <p className="text-xs text-gray-500">Health Report ▼</p>
                        </div>
                      </div>
                      
                      {/* Health indicators */}
                      <div className="ml-13 space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: crop.healthColor }}></div>
                          <span className="text-xs">{crop.health}</span>
                          <span className="text-xs text-gray-500">{crop.healthPercent}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-xs">Medium Nitrogen</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-xs">Open Soil Moisture</span>
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
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto"></div>
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
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto"></div>
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
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto"></div>
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
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

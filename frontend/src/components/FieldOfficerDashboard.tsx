import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, MapPin, Edit, Sun, X, UserPlus } from 'lucide-react';
import { farmerService } from '../services/farmerService';

const FieldOfficerDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoisture, setSelectedMoisture] = useState('Crop Moisture');
  const [selectedCrop, setSelectedCrop] = useState('Select Crop');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    farm_size: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  useEffect(() => {
    // Component mounted
  }, []);

  const handleRegisterFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    try {
      // First, register the farmer as a user
      const userResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          role: 'farmer'
        })
      });

      const userData = await userResponse.json();

      if (!userResponse.ok) {
        setRegisterError(userData.message || 'Failed to create user account');
        return;
      }

      // Then create the farmer profile
      const farmerData = {
        name: registerForm.name,
        user_id: userData.userId,
        phone: registerForm.phone,
        address: registerForm.address,
        farm_size: parseFloat(registerForm.farm_size),
        status: 'active'
      };

      await farmerService.createFarmer(farmerData);
      
      setRegisterSuccess('✅ Farmer registered successfully!');
      setRegisterForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        farm_size: ''
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setShowRegisterModal(false);
        setRegisterSuccess('');
      }, 2000);
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setRegisterError('Failed to register farmer');
    }
  };

  // Crop category data for pie chart
  const cropCategoryData = [
    { name: 'Fruits', value: 20, count: 14600, color: '#FFA500' },
    { name: 'Vegetables', value: 38, count: 2700, color: '#90EE90' },
    { name: 'Grains', value: 33, count: 364500, color: '#8FBC8F' }
  ];

  // Crop health data for pie chart
  const cropHealthData = [
    { name: 'Good', value: 70, color: '#90EE90' },
    { name: 'Medium', value: 25, color: '#FFD700' },
    { name: 'Poor', value: 5, color: '#FF6B6B' }
  ];
  console.log('Crop health data loaded', cropHealthData);

  // Crop growth monitoring data
  const growthData = [
    { date: 'Mar 10', openSoil: 20, low: 35, ideal: 45, high: 30, cloud: 25 },
    { date: 'Tue 21', openSoil: 25, low: 40, ideal: 50, high: 35, cloud: 30 },
    { date: 'Wed 22', openSoil: 30, low: 45, ideal: 55, high: 40, cloud: 35 },
    { date: 'Thu 23', openSoil: 35, low: 50, ideal: 60, high: 45, cloud: 40 },
    { date: 'Fri 24', openSoil: 40, low: 55, ideal: 65, high: 50, cloud: 45 },
    { date: 'Sat 25', openSoil: 45, low: 60, ideal: 70, high: 55, cloud: 50 },
    { date: 'Sun 26', openSoil: 50, low: 65, ideal: 75, high: 60, cloud: 55 },
    { date: 'Mon 27', openSoil: 55, low: 70, ideal: 80, high: 65, cloud: 60 },
    { date: 'Tue 28', openSoil: 60, low: 75, ideal: 85, high: 70, cloud: 65 }
  ];

  // My crops data
  const myCropsData = [
    { name: 'Barley', progress: 90, color: '#90EE90', status: 'Excellent' },
    { name: 'Millet', progress: 65, color: '#90EE90', status: 'Sprouting' },
    { name: 'Corn', progress: 25, color: '#DEB887', status: 'Planted' },
    { name: 'Oats', progress: 70, color: '#FFD700', status: 'Sprouting' },
    { name: 'Rice', progress: 10, color: '#FFA500', status: 'Planted' },
    { name: 'Wheat', progress: 100, color: '#8B4513', status: 'Harvest' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }
        
        .gradient-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4 animate-slideIn">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse-custom">
                  <span className="text-white font-bold text-lg">🌾</span>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    FARM MANAGEMENT
                  </span>
                  <div className="text-sm text-gray-500 font-medium">Field Officer Portal</div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 animate-slideIn">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-3 rounded-xl shadow-md hover-lift">
                <Sun className="w-5 h-5 text-yellow-600" />
                <div>
                  <span className="text-lg font-bold text-yellow-700">24°C</span>
                  <div className="text-xs text-yellow-600">Partly Sunny</div>
                </div>
              </div>
              <button className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg hover-lift">
                <span className="text-white text-lg">🔔</span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg hover-lift"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Sidebar and Main Content */}
        <div className="flex gap-8 animate-fadeInUp">
          {/* Enhanced Sidebar */}
          <div className="w-72 glass-effect rounded-2xl shadow-xl p-6 hover-lift">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Navigation</h3>
              <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
            </div>
            <nav className="space-y-3">
              <div className="flex items-center space-x-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-slideIn">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📊</span>
                </div>
                <span className="font-semibold">Dashboard</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer hover-lift">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🌱</span>
                </div>
                <span className="font-medium">Add Crops</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer hover-lift">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium">Add Location</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer hover-lift">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📈</span>
                </div>
                <span className="font-medium">Analytics</span>
              </div>
              <div 
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center space-x-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-xl shadow-lg cursor-pointer hover-lift"
              >
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="font-semibold">Register Farmer</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-700 px-4 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer hover-lift">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm">⚙️</span>
                </div>
                <span className="font-medium">Settings</span>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Enhanced Search Bar */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg p-6 hover-lift">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-6 h-6" />
                <input
                  type="text"
                  placeholder="🔍 Search crops, locations, or farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300 text-lg font-medium bg-white shadow-inner"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Crops Overview and Farm Image */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Crops Overview */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 hover-lift">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🌾 Crops Overview
                  </h2>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-custom"></div>
                </div>
                
                {/* Enhanced Category/Health Toggle */}
                <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-2 mb-8 shadow-inner">
                  <button className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg font-semibold transition-all duration-300 hover:shadow-xl">
                    📊 By Category
                  </button>
                  <button className="flex-1 py-3 px-6 text-gray-600 font-medium hover:text-gray-800 transition-colors duration-300">
                    🏥 By Health
                  </button>
                </div>

                {/* Enhanced Pie Chart */}
                <div className="h-72 mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl opacity-50"></div>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cropCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {cropCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Enhanced Legend */}
                <div className="space-y-4">
                  {cropCategoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-md" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="font-semibold text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{item.count.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{item.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Farm Image */}
              <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl p-8 hover-lift">
                <div className="relative h-80 bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500 rounded-2xl overflow-hidden shadow-inner">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full animate-pulse-custom"></div>
                    <div className="absolute top-12 right-8 w-6 h-6 bg-white rounded-full animate-pulse-custom" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-8 left-8 w-4 h-4 bg-white rounded-full animate-pulse-custom" style={{animationDelay: '1s'}}></div>
                  </div>
                  
                  {/* Enhanced Farm Info Card */}
                  <div className="absolute top-6 right-6 glass-effect rounded-2xl p-4 shadow-2xl hover-lift">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-gray-800">Malakwal Farm</span>
                      <Edit className="w-4 h-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white bg-opacity-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600 mb-1">Health</div>
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span className="text-xs font-bold text-green-700">Good</span>
                        </div>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600 mb-1">Sowing</div>
                        <div className="text-xs font-bold text-gray-800">Feb 21</div>
                      </div>
                      <div className="bg-white bg-opacity-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600 mb-1">Harvest</div>
                        <div className="text-xs font-bold text-gray-800">Apr 25</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Farm visualization elements */}
                  <div className="absolute bottom-6 left-6 flex space-x-2">
                    <div className="w-3 h-8 bg-green-600 rounded-t-full opacity-80"></div>
                    <div className="w-3 h-6 bg-green-500 rounded-t-full opacity-60"></div>
                    <div className="w-3 h-10 bg-green-700 rounded-t-full opacity-90"></div>
                    <div className="w-3 h-7 bg-green-600 rounded-t-full opacity-70"></div>
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
                    <select 
                      value={selectedMoisture}
                      onChange={(e) => setSelectedMoisture(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option>Crop Moisture</option>
                      <option>Soil pH</option>
                      <option>Temperature</option>
                    </select>
                    <select 
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option>Select Crop</option>
                      <option>Wheat</option>
                      <option>Corn</option>
                      <option>Rice</option>
                    </select>
                  </div>
                </div>

                {/* Moisture Level Indicators */}
                <div className="flex justify-between mb-4 text-xs">
                  <div className="text-center">
                    <div className="text-red-500 font-medium">0.1 Acres</div>
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
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
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
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                          <span className="font-medium text-sm">{crop.name}</span>
                        </div>
                        <span className="text-xs text-gray-600">{crop.status}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${crop.progress}%`, 
                            backgroundColor: crop.color 
                          }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-gray-600">{crop.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Farmer Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeInUp">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">👨‍🌾 Register New Farmer</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRegisterFarmer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter farmer's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="farmer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10,15}"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  value={registerForm.address}
                  onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter farmer's address"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Size (acres) *
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0"
                  value={registerForm.farm_size}
                  onChange={(e) => setRegisterForm({ ...registerForm, farm_size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 50.5"
                />
              </div>

              {registerSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {registerSuccess}
                </div>
              )}

              {registerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {registerError}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Register Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldOfficerDashboard;

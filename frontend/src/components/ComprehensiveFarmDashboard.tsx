import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Bell, Settings, User, MapPin, Camera, Activity, Droplets, Thermometer, Wind, Eye } from 'lucide-react';
import { useWallpaper } from '../contexts/WallpaperContext';
import { useAuth } from '../contexts/AuthContext';
import WallpaperGallery from './WallpaperGallery';

const ComprehensiveFarmDashboard: React.FC = () => {
  const { currentWallpaper, setWallpaper } = useWallpaper();
  const { logout } = useAuth();
  const [showWallpaperGallery, setShowWallpaperGallery] = useState(false);

  // Rainfall data for area chart
  const rainfallData = [
    { time: '12 AM', rainfall: 0 },
    { time: '2 AM', rainfall: 0.5 },
    { time: '4 AM', rainfall: 1.2 },
    { time: '6 AM', rainfall: 2.1 },
    { time: '8 AM', rainfall: 3.5 },
    { time: '10 AM', rainfall: 4.2 },
    { time: '12 PM', rainfall: 5.8 },
    { time: '2 PM', rainfall: 6.2 },
    { time: '4 PM', rainfall: 5.5 },
    { time: '6 PM', rainfall: 4.1 },
    { time: '8 PM', rainfall: 2.8 },
    { time: '10 PM', rainfall: 1.5 }
  ];

  // Soil moisture data
  const soilMoistureData = [
    { day: 'Mon', moisture: 45 },
    { day: 'Tue', moisture: 52 },
    { day: 'Wed', moisture: 48 },
    { day: 'Thu', moisture: 61 },
    { day: 'Fri', moisture: 55 },
    { day: 'Sat', moisture: 67 },
    { day: 'Sun', moisture: 43 }
  ];

  // Cattle behavior data
  const cattleBehaviorData = [
    { name: 'Resting', count: 287, color: '#10B981', percentage: 45 },
    { name: 'Grazing', count: 156, color: '#3B82F6', percentage: 25 },
    { name: 'Drinking', count: 89, color: '#F59E0B', percentage: 15 },
    { name: 'Moving', count: 68, color: '#EF4444', percentage: 15 }
  ];

  const handleWallpaperSelect = (wallpaper: any) => {
    setWallpaper(wallpaper);
    setShowWallpaperGallery(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      {/* Top Header */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="flex justify-between items-center">
          {/* Left - Farm Info */}
          <div className="flex items-center space-x-4">
            <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
              AARAS Farm - Farmingall Goa
            </div>
            <div className="text-white font-medium">
              Saturday, 10th February 2024
            </div>
          </div>

          {/* Right - Search and Controls */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Type here..."
                className="bg-green-800 text-white placeholder-white/70 rounded-lg pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Bell className="w-6 h-6 text-white/80 hover:text-white cursor-pointer" />
              <Settings className="w-6 h-6 text-white/80 hover:text-white cursor-pointer" />
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <button 
                onClick={logout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-black/30 backdrop-blur-md border-r border-white/20 p-4">
          <div className="text-white text-lg font-bold mb-8">Farm management</div>

          <nav className="space-y-2 mb-8">
            <div className="flex items-center space-x-3 bg-green-600 text-white px-4 py-3 rounded-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="font-medium">Dashboard</span>
            </div>
            <button className="w-full flex items-center space-x-3 text-white/80 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span>Livestock</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-white/80 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span>Weather</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-white/80 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <Camera className="w-4 h-4" />
              <span>CCTV</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-white/80 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <Activity className="w-4 h-4" />
              <span>Actuators</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-white/80 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span>Sensors</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-white/80 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
              <User className="w-4 h-4" />
              <span>User drone</span>
            </button>
          </nav>

          <div className="border-t border-white/20 pt-4">
            <div className="text-white/60 text-sm mb-4">ACCOUNT PAGES</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                <span className="text-sm">Farmers</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80">
                <div className="w-6 h-6 bg-white/20 rounded-full"></div>
                <span className="text-sm">Profile</span>
              </div>
            </div>
          </div>

          {/* Bottom Logo */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-green-600 text-white p-3 rounded-lg">
              <div className="text-xs font-bold">Creative</div>
              <div className="text-xs">Farm Check Goa</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Top Stats Bar */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-sm opacity-80">Livestock today</div>
              <div className="text-2xl font-bold">250</div>
              <div className="text-xs text-blue-300">📊</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-sm opacity-80">Actuators</div>
              <div className="text-2xl font-bold">50</div>
              <div className="text-xs text-green-300">🎯</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-sm opacity-80">User drone</div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-yellow-300">🚁</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-sm opacity-80">Sensors</div>
              <div className="text-2xl font-bold">94.5%</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: '94.5%' }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-sm opacity-80">CCTV</div>
              <div className="text-2xl font-bold">64.1%</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '64.1%' }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-sm opacity-80">Weather</div>
              <div className="text-2xl font-bold">65.1%</div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div className="bg-purple-400 h-2 rounded-full" style={{ width: '65.1%' }}></div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Mark Johnson Profile Card */}
            <div className="col-span-3 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="text-lg font-semibold mb-2">Mark Johnson</div>
              <div className="text-sm opacity-80 mb-4">Analyze the past data and predict the future</div>
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block">
                Reports
              </div>
              <div className="mt-4 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg opacity-80"></div>
            </div>

            {/* Weather Report */}
            <div className="col-span-3 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">Weather Report</div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">See all</button>
              </div>
              <div className="text-4xl font-bold mb-2">37°C</div>
              <div className="text-sm opacity-80 mb-4">77% Humid</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Today: 6.5</div>
                <div>Tomorrow: 6.5</div>
                <div>Tuesday: 6.5</div>
                <div>Wednesday: 6.5</div>
              </div>
              <div className="mt-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <div className="text-2xl">☀️</div>
              </div>
            </div>

            {/* Weather Forecast */}
            <div className="col-span-3 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="text-lg font-semibold mb-4">Weather Forecast by Google</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tomorrow</span>
                  <span>26°C/19°C</span>
                  <span>No Rain</span>
                </div>
                <div className="flex justify-between">
                  <span>Tuesday</span>
                  <span>28°C/20°C</span>
                  <span>No Rain</span>
                </div>
                <div className="flex justify-between">
                  <span>Wednesday</span>
                  <span>30°C/22°C</span>
                  <span>Heavy Rain</span>
                </div>
                <div className="flex justify-between">
                  <span>Thursday</span>
                  <span>25°C/18°C</span>
                  <span>Light Rain</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday</span>
                  <span>27°C/20°C</span>
                  <span>Cloudy</span>
                </div>
              </div>
            </div>

            {/* Satellite Map */}
            <div className="col-span-3 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="h-48 bg-gradient-to-br from-green-600 to-yellow-600 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-white" />
                </div>
                {/* Simulated farm areas */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-red-500 rounded opacity-80"></div>
                <div className="absolute top-8 right-6 w-6 h-6 bg-green-500 rounded opacity-80"></div>
                <div className="absolute bottom-6 left-8 w-10 h-6 bg-yellow-500 rounded opacity-80"></div>
                <div className="absolute bottom-4 right-4 w-12 h-8 bg-blue-500 rounded opacity-80"></div>
              </div>
            </div>

            {/* Rainfall Chart */}
            <div className="col-span-6 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">Rainfall (inches)</div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Monitoring Report</button>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rainfallData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.8)" />
                    <YAxis stroke="rgba(255,255,255,0.8)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rainfall" 
                      stroke="#3B82F6" 
                      fill="url(#blueGradient)" 
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cattle Behavior */}
            <div className="col-span-3 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="text-lg font-semibold mb-4">Cattle Behaviour</div>
              <div className="text-sm opacity-80 mb-4">Total Devices - 300</div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {cattleBehaviorData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="w-8 h-8 rounded mx-auto mb-1"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="text-xs">{item.name}</div>
                    <div className="text-sm font-bold">{item.count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="col-span-3 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="text-lg font-semibold mb-4">Notifications</div>
              <div className="text-sm opacity-80 mb-2">+30% this week</div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>Cow 113 went offline at location - Map</div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                  <div>Wild Animal Detected on cam 3</div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>Sheep Detected for Cow 84 at location - Map</div>
                </div>
              </div>
            </div>

            {/* CCTV Feeds */}
            <div className="col-span-6 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-semibold">CCTV</div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>View all</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-600 rounded-lg h-32 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600"></div>
                  <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
                    Farm Field View
                  </div>
                </div>
                <div className="bg-green-600 rounded-lg h-32 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-700"></div>
                  <div className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
                    Livestock Area
                  </div>
                </div>
              </div>
            </div>

            {/* Soil Moisture */}
            <div className="col-span-6 bg-white/10 backdrop-blur-md rounded-xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-lg font-semibold">Soil Moisture</div>
                  <div className="text-sm opacity-80">Total Devices - 100 | Online Devices - 98</div>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={soilMoistureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.8)" />
                    <YAxis stroke="rgba(255,255,255,0.8)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Bar dataKey="moisture" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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

export default ComprehensiveFarmDashboard;

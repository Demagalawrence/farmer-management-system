import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, Cloud, Droplets, Wind } from 'lucide-react';

interface ExecutiveOverviewProps {
  financialData: {
    currentPL: number;
    cashFlow: number;
    budgetVsActual: number;
  };
  operationalData: {
    activeTasks: number;
    pendingTasks: number;
    criticalAlerts: Array<{id: string; message: string; severity: 'high' | 'medium' | 'low'}>;
  };
  weatherData?: {
    current: { temp: number; condition: string; humidity: number; windSpeed: number };
    forecast: Array<{ day: string; high: number; low: number; condition: string }>;
  };
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ 
  financialData, 
  operationalData,
  weatherData 
}) => {
  return (
    <div className="space-y-6">
      {/* Financial Health Snapshot */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">💰 Financial Health Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* P&L */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Profit/Loss (Current)</p>
                <p className={`text-2xl font-bold mt-1 ${financialData.currentPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {financialData.currentPL >= 0 ? '+' : ''}UGX {Math.abs(financialData.currentPL).toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  {financialData.currentPL >= 0 ? (
                    <><TrendingUp className="w-4 h-4 text-green-600 mr-1" /><span className="text-xs text-green-600">Profitable</span></>
                  ) : (
                    <><TrendingDown className="w-4 h-4 text-red-600 mr-1" /><span className="text-xs text-red-600">Loss</span></>
                  )}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </div>

          {/* Cash Flow */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div>
              <p className="text-sm text-gray-600 font-medium">Cash Flow Status</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">UGX {financialData.cashFlow.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-2">Available Balance</p>
            </div>
          </div>

          {/* Budget vs Actual */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div>
              <p className="text-sm text-gray-600 font-medium">Budget Performance</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{financialData.budgetVsActual}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className={`h-2 rounded-full ${financialData.budgetVsActual > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{width: `${Math.min(financialData.budgetVsActual, 100)}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">vs. Planned Budget</p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">⚙️ Operational Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task Summary */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-gray-800 mb-3">Active & Pending Tasks</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Tasks</span>
                <span className="text-lg font-bold text-green-600">{operationalData.activeTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending/Overdue</span>
                <span className="text-lg font-bold text-red-600">{operationalData.pendingTasks}</span>
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              Critical Alerts
            </h3>
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {operationalData.criticalAlerts.length > 0 ? (
                operationalData.criticalAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start space-x-2">
                    <span className={`w-2 h-2 rounded-full mt-1 ${
                      alert.severity === 'high' ? 'bg-red-500' : 
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    <span className="text-xs text-gray-700">{alert.message}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No critical alerts</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weather & Forecast */}
      {weatherData && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">🌤️ Weather and Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Weather */}
            <div className="p-4 bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg border border-sky-200">
              <h3 className="font-semibold text-gray-800 mb-3">Current Conditions</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-sky-600">{weatherData.current.temp}°C</p>
                  <p className="text-sm text-gray-600 mt-1">{weatherData.current.condition}</p>
                </div>
                <Cloud className="w-16 h-16 text-sky-400 opacity-50" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="flex items-center">
                  <Droplets className="w-4 h-4 text-sky-600 mr-1" />
                  <span>{weatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center">
                  <Wind className="w-4 h-4 text-sky-600 mr-1" />
                  <span>{weatherData.current.windSpeed} km/h</span>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">7-Day Forecast</h3>
              <div className="space-y-2">
                {weatherData.forecast.slice(0, 5).map((day, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 w-16">{day.day}</span>
                    <span className="text-gray-500 text-xs flex-1">{day.condition}</span>
                    <span className="text-gray-800 font-medium">{day.high}° / {day.low}°</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

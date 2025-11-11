import React from 'react';
import { Users, Clock, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: 'clocked-in' | 'clocked-out';
  hoursToday: number;
  tasksCompleted: number;
}

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'down';
  nextService: string;
  hoursLogged: number;
}

interface LaborResourceManagementProps {
  teamMembers: TeamMember[];
  equipment: Equipment[];
  laborMetrics: {
    totalHoursWeek: number;
    tasksCompleted: number;
    laborCost: number;
  };
}

export const LaborResourceManagement: React.FC<LaborResourceManagementProps> = ({
  teamMembers,
  equipment,
  laborMetrics
}) => {
  const clockedInCount = teamMembers.filter(m => m.status === 'clocked-in').length;
  const downEquipment = equipment.filter(e => e.status === 'down');
  const maintenanceEquipment = equipment.filter(e => e.status === 'maintenance');

  return (
    <div className="space-y-6">
      {/* Labor Efficiency Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Labor Efficiency
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Hours (This Week)</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{laborMetrics.totalHoursWeek}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400 opacity-50" />
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div>
              <p className="text-sm text-gray-600 font-medium">Tasks Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{laborMetrics.tasksCompleted}</p>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <p className="text-sm text-gray-600 font-medium">Labor Cost</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">UGX {laborMetrics.laborCost.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Clock-in/Clock-out Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Team Status</h3>
            <span className="text-sm text-gray-600">
              <span className="text-green-600 font-bold">{clockedInCount}</span> / {teamMembers.length} Clocked In
            </span>
          </div>
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${member.status === 'clocked-in' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <div className="font-medium text-gray-800">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-700">{member.hoursToday}h today</div>
                  <div className="text-xs text-gray-500">{member.tasksCompleted} tasks done</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment & Maintenance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <Wrench className="w-6 h-6 mr-2 text-orange-600" />
          Equipment & Maintenance
        </h2>

        {/* Downtime Alerts */}
        {downEquipment.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-800 font-semibold mb-3">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Equipment Downtime Alerts ({downEquipment.length})
            </div>
            <div className="space-y-2">
              {downEquipment.map(equip => (
                <div key={equip.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-sm font-medium text-gray-800">{equip.name}</span>
                  <span className="text-xs text-red-600 font-semibold">OUT OF SERVICE</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Schedule */}
        {maintenanceEquipment.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-yellow-800 font-semibold mb-3">
              <Wrench className="w-5 h-5 mr-2" />
              Scheduled Maintenance ({maintenanceEquipment.length})
            </div>
            <div className="space-y-2">
              {maintenanceEquipment.map(equip => (
                <div key={equip.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-sm font-medium text-gray-800">{equip.name}</span>
                  <span className="text-xs text-yellow-600 font-semibold">IN MAINTENANCE</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Equipment Status */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800 mb-3">All Equipment</h3>
          {equipment.map(equip => (
            <div key={equip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
              <div className="flex items-center space-x-3">
                {equip.status === 'operational' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {equip.status === 'maintenance' && <Wrench className="w-5 h-5 text-yellow-500" />}
                {equip.status === 'down' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                <div>
                  <div className="font-medium text-gray-800">{equip.name}</div>
                  <div className="text-xs text-gray-500">
                    Status: <span className={`font-semibold ${
                      equip.status === 'operational' ? 'text-green-600' :
                      equip.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{equip.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-700">{equip.hoursLogged}h logged</div>
                <div className="text-xs text-gray-500">Next service: {equip.nextService}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

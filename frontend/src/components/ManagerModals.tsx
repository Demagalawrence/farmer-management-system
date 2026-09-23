import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  formError: string;
  formSuccess: string;
}

interface AddCropModalProps extends ModalProps {
  cropForm: any;
  setCropForm: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
  farmers: any[];
  fields: any[];
}

export const AddCropModal: React.FC<AddCropModalProps> = ({
  show, onClose, formError, formSuccess, cropForm, setCropForm, handleSubmit, farmers, fields
}) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Crop/Harvest</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {formError && <div className="mb-3 p-2 bg-red-50 text-red-600 rounded text-sm">{formError}</div>}
        {formSuccess && <div className="mb-3 p-2 bg-green-50 text-green-600 rounded text-sm">{formSuccess}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Farmer *</label>
            <select 
              required 
              value={cropForm.farmer_id} 
              onChange={(e) => setCropForm({...cropForm, farmer_id: e.target.value, field_id: ''})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Farmer</option>
              {farmers.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Field *</label>
            <select 
              required 
              value={cropForm.field_id} 
              onChange={(e) => setCropForm({...cropForm, field_id: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={!cropForm.farmer_id}
            >
              <option value="">Select Field</option>
              {fields.filter(f => String(f.farmer_id) === cropForm.farmer_id).map(f => 
                <option key={f._id} value={f._id}>{f.field_name || f.location}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type *</label>
            <input 
              required 
              type="text" 
              value={cropForm.crop_type} 
              onChange={(e) => setCropForm({...cropForm, crop_type: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
              placeholder="e.g., Wheat, Corn, Rice" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (tons) *</label>
            <input 
              required 
              type="number" 
              step="0.01" 
              value={cropForm.quantity_tons} 
              onChange={(e) => setCropForm({...cropForm, quantity_tons: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quality Grade</label>
            <select 
              value={cropForm.quality_grade} 
              onChange={(e) => setCropForm({...cropForm, quality_grade: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="A">A - Excellent</option>
              <option value="B">B - Good</option>
              <option value="C">C - Fair</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
            <input 
              type="date" 
              value={cropForm.harvest_date} 
              onChange={(e) => setCropForm({...cropForm, harvest_date: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Harvest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface NewFarmModalProps extends ModalProps {
  farmForm: any;
  setFarmForm: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
}

export const NewFarmModal: React.FC<NewFarmModalProps> = ({
  show, onClose, formError, formSuccess, farmForm, setFarmForm, handleSubmit
}) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Register New Farmer</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {formError && <div className="mb-3 p-2 bg-red-50 text-red-600 rounded text-sm">{formError}</div>}
        {formSuccess && <div className="mb-3 p-2 bg-green-50 text-green-600 rounded text-sm whitespace-pre-wrap">{formSuccess}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Farmer Name *</label>
            <input 
              required 
              type="text" 
              value={farmForm.name} 
              onChange={(e) => setFarmForm({...farmForm, name: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input 
              required 
              type="email" 
              value={farmForm.email} 
              onChange={(e) => setFarmForm({...farmForm, email: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="farmer@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input 
              required 
              type="tel" 
              value={farmForm.phone} 
              onChange={(e) => setFarmForm({...farmForm, phone: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0700000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input 
              required 
              type="text" 
              value={farmForm.address} 
              onChange={(e) => setFarmForm({...farmForm, address: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="District, Village"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Farm Size (hectares) *</label>
            <input 
              required 
              type="number" 
              step="0.1" 
              value={farmForm.farm_size} 
              onChange={(e) => setFarmForm({...farmForm, farm_size: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              placeholder="10.5"
            />
          </div>
          <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
            <strong>Note:</strong> A temporary password will be generated for this farmer. It will be displayed after successful registration.
          </div>
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Farmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddWorkerModalProps extends ModalProps {
  workerForm: any;
  setWorkerForm: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent) => void;
}

export const AddWorkerModal: React.FC<AddWorkerModalProps> = ({
  show, onClose, formError, formSuccess, workerForm, setWorkerForm, handleSubmit
}) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Worker</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        {formError && <div className="mb-3 p-2 bg-red-50 text-red-600 rounded text-sm">{formError}</div>}
        {formSuccess && <div className="mb-3 p-2 bg-green-50 text-green-600 rounded text-sm">{formSuccess}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input 
              required 
              type="text" 
              value={workerForm.name} 
              onChange={(e) => setWorkerForm({...workerForm, name: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input 
              required 
              type="email" 
              value={workerForm.email} 
              onChange={(e) => setWorkerForm({...workerForm, email: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="worker@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input 
              required 
              type="password" 
              value={workerForm.password} 
              onChange={(e) => setWorkerForm({...workerForm, password: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              minLength={8}
            />
            <p className="text-xs text-gray-500 mt-1">Password must contain: uppercase, lowercase, and number</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
            <select 
              value={workerForm.role} 
              onChange={(e) => setWorkerForm({...workerForm, role: e.target.value})} 
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="field_officer">Field Officer</option>
              <option value="finance">Finance</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ReportsModalProps extends ModalProps {
  farmers: any[];
  recentHarvests: any[];
  pendingPayments: any[];
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  show, onClose, farmers, recentHarvests, pendingPayments
}) => {
  if (!show) return null;
  
  const totalFarmers = farmers.length;
  const totalHarvests = recentHarvests.length;
  const totalPending = pendingPayments.length;
  const totalHarvestQty = recentHarvests.reduce((sum, h) => sum + (Number(h.quantity_tons) || 0), 0);
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">System Reports</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Farmers</div>
              <div className="text-2xl font-bold text-green-700">{totalFarmers}</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Recent Harvests</div>
              <div className="text-2xl font-bold text-blue-700">{totalHarvests}</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-sm text-gray-600">Pending Approvals</div>
              <div className="text-2xl font-bold text-yellow-700">{totalPending}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Harvest Qty</div>
              <div className="text-2xl font-bold text-purple-700">{totalHarvestQty.toFixed(2)} tons</div>
            </div>
          </div>

          {/* Recent Harvests Table */}
          <div>
            <h4 className="font-semibold mb-3">Recent Harvests Summary</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="py-2 px-3">Crop</th>
                    <th className="py-2 px-3">Quantity</th>
                    <th className="py-2 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {recentHarvests.slice(0, 5).map((h, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2 px-3">{h.crop_type || 'N/A'}</td>
                      <td className="py-2 px-3">{Number(h.quantity_tons || 0).toFixed(2)} tons</td>
                      <td className="py-2 px-3">{h.harvest_date ? new Date(h.harvest_date).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                  {recentHarvests.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 px-3 text-center text-gray-500">No harvests recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Print Report
            </button>
            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

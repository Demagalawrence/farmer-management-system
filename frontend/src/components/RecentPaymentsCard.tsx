import React from 'react';
import { Clock, ArrowRight, DollarSign } from 'lucide-react';
import { formatUGX } from '../utils/currency';

interface Payment {
  _id?: string;
  id?: string;
  farmer_id: any;
  amount: number;
  status: string;
  payment_type?: string;
  created_at?: string;
  payment_date?: string;
}

interface RecentPaymentsCardProps {
  payments: Payment[];
  title: string;
  onViewAll: () => void;
  emptyMessage?: string;
}

const RecentPaymentsCard: React.FC<RecentPaymentsCardProps> = ({
  payments,
  title,
  onViewAll,
  emptyMessage = 'No recent payments',
}) => {
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const paymentDate = new Date(date);
    const diffMs = now.getTime() - paymentDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return paymentDate.toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return '✓';
      case 'approved':
        return '⏳';
      case 'pending':
        return '⏱️';
      case 'rejected':
        return '✗';
      default:
        return '•';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'approved':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Show last 5 payments
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="text-sm text-gray-500">Last 5</span>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {recentPayments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          recentPayments.map((payment) => (
            <div
              key={payment._id || payment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className={`text-xl ${getStatusColor(payment.status)}`}>
                  {getStatusIcon(payment.status)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">
                      {formatUGX(payment.amount)}
                    </span>
                    {payment.payment_type && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full capitalize">
                        {payment.payment_type}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Farmer: {String(payment.farmer_id).substring(0, 12)}...
                  </p>
                </div>
              </div>
              <div className="text-right ml-3">
                <p className="text-xs text-gray-500">
                  {getTimeAgo(payment.payment_date || payment.created_at || '')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      {payments.length > 0 && (
        <button
          onClick={onViewAll}
          className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition font-medium"
        >
          <span>View Full Payment History</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Summary Stats */}
      {payments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'paid').length}
            </p>
            <p className="text-xs text-gray-500">Paid</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'pending').length}
            </p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentPaymentsCard;

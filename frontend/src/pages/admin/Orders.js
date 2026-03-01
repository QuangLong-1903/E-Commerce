import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { useI18n } from '../../i18n';
import { EyeIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(status && { status }),
      });

      const response = await api.get(`/orders/admin/all?${params}`);
      setOrders(response.data.data.orders);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      toast.error(t('common.error') + ': ' + (error.response?.data?.message || t('common.loading')));
    } finally {
      setLoading(false);
    }
  }, [page, status, t]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders, page, status]);

  const handleApproveOrder = async (orderId, orderNumber) => {
    if (!window.confirm(t('adminOrdersActions.confirmApprove'))) {
      return;
    }
    
    try {
      await api.put(`/orders/${orderId}/status`, { 
        status: 'confirmed',
        note: 'Approved by admin'
      });
      toast.success(t('adminOrdersActions.approved'));
      fetchOrders();
    } catch (error) {
      toast.error(t('common.error') + ': ' + (error.response?.data?.message || ''));
    }
  };

  const handleRejectOrder = async (orderId, orderNumber) => {
    if (!window.confirm(t('adminOrdersActions.confirmReject'))) {
      return;
    }
    
    try {
      await api.put(`/orders/${orderId}/status`, { 
        status: 'cancelled',
        note: 'Rejected by admin'
      });
      toast.success(t('adminOrdersActions.rejected'));
      fetchOrders();
    } catch (error) {
      toast.error(t('common.error') + ': ' + (error.response?.data?.message || ''));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusTranslations = {
    pending: t('orders.pending'),
    confirmed: t('orders.confirmed'),
    processing: t('orders.processing'),
    shipped: t('orders.shipped'),
    delivered: t('orders.delivered'),
    cancelled: t('orders.cancelled'),
  };

  const paymentStatusTranslations = {
    pending: t('orders.pending'),
    paid: t('common.success'),
    failed: t('common.error'),
    refunded: t('common.refunded'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.manageOrders')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.allOrders')}</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowPathIcon className="w-5 h-5" />
          {t('common.update')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 border-b-2 border-blue-500">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-sm font-medium text-gray-700">{t('orders.status')}:</span>
          <button
            onClick={() => { setStatus(''); setPage(1); }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              status === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {t('adminOrders.allStatuses')}
          </button>
          {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                status === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {statusTranslations[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-600">{t('common.loading')}</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-600">{t('adminOrders.noOrders')}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('admin_table.orderId')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('adminOrders.customerColumn')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('adminOrders.totalAmountColumn')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('adminOrders.filterByStatus')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('adminOrders.paymentColumn')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('admin_table.orderDate')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('admin_table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">{order.user?.name}</p>
                          <p className="text-gray-600">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {t('common.currency')}{order.totalPrice?.toLocaleString('en-US')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {statusTranslations[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {order.paymentStatus === 'paid' ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-red-600" />
                          )}
                          <span className="text-sm text-gray-700">
                            {paymentStatusTranslations[order.paymentStatus]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/orders/${order._id}`)}
                            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                            title={t('common.view')}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveOrder(order._id, order.orderNumber)}
                                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                                title={t('adminOrdersActions.approve')}
                              >
                                <CheckIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectOrder(order._id, order.orderNumber)}
                                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                title={t('adminOrdersActions.reject')}
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded transition-colors ${
                      page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

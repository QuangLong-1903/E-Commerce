import React, { useEffect, useState, useCallback } from 'react';
import { useI18n } from '../../i18n';
import api from '../../services/api';
import toast from 'react-hot-toast';
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes] = await Promise.all([
        api.get('/orders/admin/stats'),
        api.get('/products/admin/stats'),
      ]);

      setStats({
        orders: statsRes.data.data,
        products: productsRes.data.data,
      });
    } catch (error) {
      toast.error(t('common.error') + ': ' + t('adminDashboard.title'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-')}/10`}>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('adminDashboard.title')}</h1>
        <p className="text-gray-600 mt-1">{t('admin.storeActivity')}</p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ShoppingCartIcon}
          label={t('adminDashboard.totalOrders')}
          value={stats?.orders?.summary?.totalOrders || 0}
          color="text-blue-600"
        />
        <StatCard
          icon={CurrencyDollarIcon}
          label={t('adminDashboard.revenue')}
          value={`${t('common.currency')}${(stats?.orders?.summary?.totalRevenue || 0).toLocaleString('en-US')}`}
          color="text-green-600"
        />
        <StatCard
          icon={ShoppingCartIcon}
          label={t('adminDashboard.totalProducts')}
          value={stats?.products?.totalProducts || 0}
          color="text-purple-600"
        />
        <StatCard
          icon={CheckCircleIcon}
          label={t('adminDashboard.outOfStock')}
          value={stats?.products?.outOfStock || 0}
          color="text-red-600"
        />
      </div>

      {/* Products Overview */}
      {stats?.products && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('adminDashboard.products')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">{t('adminDashboard.activeProducts')}</span>
                <span className="font-semibold text-blue-600">{stats.products.activeProducts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">{t('adminDashboard.featuredProducts')}</span>
                <span className="font-semibold text-blue-600">{stats.products.featuredProducts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-700">{t('adminDashboard.lowStock')}</span>
                <span className="font-semibold text-orange-600">{stats.products.lowStock}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('adminDashboard.topSelling')}</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats.products.topSelling?.slice(0, 5).map((product, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600">{product.price.toLocaleString('vi-VN')} {t('common.currency')}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    {product.sold} {t('adminDashboard.sold')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders by Status */}
      {stats?.orders?.statusCounts && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('adminDashboard.ordersByStatus')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { status: 'pending', label: t('orders.pending'), color: 'bg-yellow-100 text-yellow-800' },
              { status: 'confirmed', label: t('orders.confirmed'), color: 'bg-blue-100 text-blue-800' },
              { status: 'processing', label: t('orders.processing'), color: 'bg-purple-100 text-purple-800' },
              { status: 'shipped', label: t('orders.shipped'), color: 'bg-indigo-100 text-indigo-800' },
              { status: 'delivered', label: t('orders.delivered'), color: 'bg-green-100 text-green-800' },
              { status: 'cancelled', label: t('orders.cancelled'), color: 'bg-red-100 text-red-800' },
            ].map((item) => {
              const count = stats.orders.statusCounts.find((s) => s._id === item.status)?.count || 0;
              return (
                <div key={item.status} className={`p-4 rounded-lg ${item.color} text-center`}>
                  <p className="text-sm font-semibold">{count}</p>
                  <p className="text-xs mt-1">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Products by Category */}
      {stats?.products?.productsByCategory && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('adminDashboard.productsByCategory')}</h3>
          <div className="space-y-2">
            {stats.products.productsByCategory.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b">
                <span className="font-semibold text-gray-900">{cat.category}</span>
                <div className="flex items-center gap-2 flex-1 ml-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(cat.count / Math.max(...stats.products.productsByCategory.map((c) => c.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 min-w-fit">
                    {cat.count} {t('admin_table.products')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../store/slices/orderSlice';
import { resetCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Vietnam',
    paymentMethod: 'cod',
    note: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const shippingCost = totalPrice > 500 ? 0 : 30;
  const taxPrice = Math.round(totalPrice * 0.1);
  const finalTotal = totalPrice + shippingCost + taxPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderData = {
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      note: formData.note,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();

      dispatch(resetCart());
      toast.success('Đơn hàng được tạo thành công!');
      navigate(`/orders/${result._id}`);
    } catch (error) {
      toast.error(error || 'Tạo đơn hàng thất bại');
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  // Thanh toán VNPay
  const handleVnpayPayment = async () => {
    try {
      if (items.length === 0) {
        toast.error('Giỏ hàng trống');
        return;
      }

      // Tạo đơn hàng trước
      const orderData = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: 'vnpay', // Set payment method to VNPay
        note: formData.note,
      };

      console.log('Creating order for VNPay:', orderData);
      const orderResult = await dispatch(createOrder(orderData)).unwrap();
      console.log('Order created:', orderResult);
      console.log('Returned order ID:', orderResult?._id);

      // redirect directly to server endpoint that will build & sign the VNPay URL
      dispatch(resetCart());
      window.location.href =  `${process.env.REACT_APP_API_URL.replace('/api', '')}/api/vnpay/redirect/${orderResult._id}`;
    } catch (err) {
      console.error('VNPay error:', err);
      toast.error(err?.message || 'Lỗi khi thanh toán VNPay');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery (COD)' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'momo', label: 'MoMo Wallet' },
                  { value: 'zalopay', label: 'ZaloPay' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                      formData.paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={formData.paymentMethod === method.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* VNPay Payment */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-green-500">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thanh toán qua VNPay</h2>
              <p className="text-gray-600 text-sm mb-4">
                Thanh toán trực tuyến an toàn với VNPay. Đơn hàng sẽ được tạo ngay sau khi bạn hoàn tất thanh toán.
              </p>
              <button
                type="button"
                onClick={handleVnpayPayment}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                💳 Thanh toán qua VNPay
              </button>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Notes (Optional)
              </h2>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={3}
                className="input"
                placeholder="Special instructions for delivery..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => {
                  const product = item.product;
                  const mainImage = product?.images?.find((img) => img.isMain) || product?.images?.[0];
                  return (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={mainImage?.url || 'https://via.placeholder.com/60'}
                        alt={product?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">
                          {product?.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="text-sm font-medium">
                        ${(item.quantity * item.price).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <hr className="my-4" />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;

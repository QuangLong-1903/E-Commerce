const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
  getRevenueReport,
} = require('../controllers/order.controller');

const { protect, admin } = require('../middleware/auth');
const {
  createOrderValidation,
  updateOrderStatusValidation,
  mongoIdValidation,
  paginationValidation,
} = require('../middleware/validate');

// User routes (require authentication)
router.post('/', protect, createOrderValidation, createOrder);
router.get('/my-orders', protect, paginationValidation, getMyOrders);
router.get('/:id', protect, mongoIdValidation('id'), getOrderById);
router.put('/:id/cancel', protect, mongoIdValidation('id'), cancelOrder);

// Admin routes
router.get('/admin/all', protect, admin, paginationValidation, getAllOrders);
router.get('/admin/stats', protect, admin, getOrderStats);
router.get('/admin/revenue', protect, admin, getRevenueReport);
router.put(
  '/:id/status',
  protect,
  admin,
  mongoIdValidation('id'),
  updateOrderStatusValidation,
  updateOrderStatus
);
router.put('/:id/payment', protect, admin, mongoIdValidation('id'), updatePaymentStatus);

module.exports = router;

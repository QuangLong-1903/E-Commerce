const express = require('express');
const router = express.Router();
const { vnpayReturn, vnpayIpn, redirectToVnpay } = require('../controllers/vnpay.controller');
const { protect } = require('../middleware/auth');

// (deprecated) VNPay URL creation endpoint removed – use GET /redirect/:orderId
// Server-side redirect to VNPay (GET /api/vnpay/redirect/:orderId)
router.get('/redirect/:orderId', redirectToVnpay);
// Xử lý return URL từ VNPay
router.get('/vnpay_return', vnpayReturn);
// Xử lý IPN từ VNPay
router.get('/vnpay_ipn', vnpayIpn);
module.exports = router;

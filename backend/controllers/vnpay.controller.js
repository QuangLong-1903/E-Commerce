const querystring = require('querystring');
const crypto = require('crypto');
const moment = require('moment');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Cấu hình VNPay
const vnp_TmnCode = process.env.VNP_TMNCODE?.trim();
const vnp_HashSecret = process.env.VNP_HASHSECRET?.trim();
const vnp_Url = process.env.VNP_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
// return URL should point to backend endpoint so we can verify before redirecting to frontend
const vnp_ReturnUrl = process.env.VNP_RETURNURL ||
  process.env.BACKEND_URL && process.env.BACKEND_URL + '/api/vnpay/vnpay_return' ||
  'http://localhost:5000/api/vnpay/vnpay_return';

// Validate config (do not dump the full secret to logs)
if (!vnp_TmnCode || !vnp_HashSecret) {
  console.error('❌ VNPay configuration missing: VNP_TMNCODE or VNP_HASHSECRET not set');
  console.error('   VNP_TMNCODE:', process.env.VNP_TMNCODE ? `[${process.env.VNP_TMNCODE}]` : 'undefined');
  const masked = vnp_HashSecret ? (`***${vnp_HashSecret.slice(-4)}`) : 'undefined';
  console.error('   VNP_HASHSECRET:', masked);
}

// NOTE: previous helper `createVnpayPayment` was removed to enforce single redirect flow.
// Clients should now request GET /api/vnpay/redirect/:orderId after creating an order.


// helper – provide human readable message for common response codes
function interpretVnpayResponse(code) {
  switch (code) {
    case '00':
      return 'Giao dịch thành công';
    case '03':
      return 'Merchant không tồn tại / sai cấu hình (Error 03)';
    case '07':
      return 'IP address không hợp lệ';
    default:
      return 'Thanh toán thất bại';
  }
}

// Xác thực checksum VNPay
function verifyVnpayChecksum(queryParams, secret) {
  const vnp_Params = { ...queryParams };

  const secureHash = vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sorted = sortObject(vnp_Params);

  const signData = querystring.stringify(sorted, { encode: false });

  const hmac = crypto.createHmac('sha512', secret.trim());
  const signed = hmac.update(signData, 'utf-8').digest('hex');

  return secureHash === signed;
}

// Xử lý return URL từ VNPay (sau khi user thanh toán)
exports.vnpayReturn = async (req, res) => {
  try {
    const vnp_Params = { ...req.query };
    console.log('📨 VNPay Return received:', {
      responseCode: vnp_Params.vnp_ResponseCode,
      txnRef: vnp_Params.vnp_TxnRef,
    });

    const isValid = verifyVnpayChecksum(vnp_Params, vnp_HashSecret);
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';

    if (!isValid) {
      console.error('❌ Checksum verification failed!');
      return res.redirect(
        `${frontend}/checkout/vnpay-return?success=false&error=checksum`
      );
    }

    const respCode = vnp_Params.vnp_ResponseCode;
    const respMessage = interpretVnpayResponse(respCode);

    // IMPORTANT: do **not** update order here. IPN is the authoritative callback.
    if (respCode === '00') {
      console.log('✅ Return URL indicates success; redirecting user');
      return res.redirect(`${frontend}/checkout/vnpay-return?success=true`);
    } else {
      console.warn('⚠️ Payment failed with code:', respCode, '-', respMessage);
      return res.redirect(
        `${frontend}/checkout/vnpay-return?success=false&code=${respCode}`
      );
    }
  } catch (error) {
    console.error('❌ VNPay return error:', error);
    return res.redirect(
      `${process.env.FRONTEND_URL}/checkout/vnpay-return?success=false&error=server`
    );
  }
};

// Xử lý IPN từ VNPay (Instant Payment Notification)
exports.vnpayIpn = async (req, res) => {
  try {
    const vnp_Params = { ...req.query };
    
    console.log('🔔 VNPay IPN received:', {
      responseCode: vnp_Params.vnp_ResponseCode,
      txnRef: vnp_Params.vnp_TxnRef,
    });
    
    const isValid = verifyVnpayChecksum(vnp_Params, vnp_HashSecret);
    if (!isValid) {
      console.error('❌ IPN Checksum verification failed!');
      return res.json({ RspCode: '97', Message: 'Sai checksum' });
    }
    
    const respCode = vnp_Params.vnp_ResponseCode;
    const respMessage = interpretVnpayResponse(respCode);

    if (respCode === '00') {
      console.log('✅ IPN: Payment confirmed');
      try {
        const order = await Order.findOne({ 'paymentDetails.vnpayTxnRef': vnp_Params.vnp_TxnRef });
        if (!order) {
          console.warn('⚠️ Order not found for IPN txnRef', vnp_Params.vnp_TxnRef);
          return res.json({ RspCode: '01', Message: 'Order not found' });
        }
        if (order.paymentStatus === 'paid') {
          console.log('ℹ️ Order already marked paid');
          return res.json({ RspCode: '02', Message: 'Already confirmed' });
        }
        const expectedAmt = Math.round(order.totalPrice * 100);
        if (expectedAmt !== Number(vnp_Params.vnp_Amount)) {
          console.warn('⚠️ Amount mismatch', expectedAmt, vnp_Params.vnp_Amount);
          return res.json({ RspCode: '04', Message: 'Amount invalid' });
        }
        // update
        order.paymentStatus = 'paid';
        order.paymentDetails = order.paymentDetails || {};
        order.paymentDetails.transactionId = vnp_Params.vnp_TransactionNo;
        order.paymentDetails.vnp_BankCode = vnp_Params.vnp_BankCode;
        order.paymentDetails.vnp_PayDate = vnp_Params.vnp_PayDate;
        order.paymentDetails.paidAt = new Date();
        await order.save();
        console.log('✅ Order updated via IPN:', order._id);
      } catch (err) {
        console.error('⚠️ Error updating order in IPN:', err);
        return res.json({ RspCode: '99', Message: 'DB error' });
      }
      return res.json({ RspCode: '00', Message: 'Confirm Success' });
    } else {
      console.warn('⚠️ IPN: Payment not successful (code', respCode, respMessage, ')');
      return res.json({ RspCode: '00', Message: 'Received but not successful' });
    }
  } catch (error) {
    console.error('❌ VNPay IPN error:', error);
    return res.json({ RspCode: '99', Message: 'System error' });
  }
};

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

// Removed debug-only hash test to avoid exposing sensitive values

// Server-side redirect to VNPay (useful to avoid client popup/timer issues on VNPay sandbox)
exports.redirectToVnpay = async (req, res) => {
  try {
    if (!vnp_TmnCode || !vnp_HashSecret) {
      return res.status(500).send('VNPay not configured');
    }

    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId, paymentMethod: 'vnpay' });
    if (!order) return res.status(404).send('Order not found');

    const amount = Math.round(order.totalPrice * 100);
    if (amount <= 0 || isNaN(amount)) return res.status(400).send('Invalid amount');

    // If the order is already paid, skip calling VNPay and forward user to success page
    if (order.paymentStatus === 'paid') {
      const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontend}/checkout/vnpay-return?success=true&alreadyPaid=true`);
    }
    // ensure txnRef exists but do not overwrite if already set
    if (order.paymentDetails?.vnpayTxnRef) {
      // if the order already has a txnRef and is no longer pending, reject further attempts
      if (order.paymentStatus && order.paymentStatus !== 'pending') {
        return res.status(400).send('Invalid payment state');
      }
    } else {
      order.paymentDetails = order.paymentDetails || {};
      order.paymentDetails.vnpayTxnRef = Date.now().toString();
      await order.save();
    }
    const vnpTxnRef = order.paymentDetails.vnpayTxnRef;

    let ipAddr = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    ipAddr = ipAddr.replace(/^::ffff:/, ''); // Remove IPv6 prefix if exists
    if (ipAddr === '::1' || !ipAddr) ipAddr = '127.0.0.1'; // Convert IPv6 loopback to IPv4

    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: String(vnp_TmnCode),
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: String(vnpTxnRef),
      vnp_OrderInfo: `Thanh toan ${order.orderNumber || orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: String(amount),
      vnp_ReturnUrl: String(vnp_ReturnUrl),
      vnp_IpAddr: String(ipAddr),
      vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    };

    const sortedParams = sortObject(vnp_Params);
    const signDataPlain = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret.trim());
    const signed = hmac.update(Buffer.from(signDataPlain, 'utf-8')).digest('hex');

    sortedParams['vnp_SecureHash'] = signed;
    const paymentUrl = `${vnp_Url}?${querystring.stringify(sortedParams, { encode: true })}`;

    // Server-side redirect
    return res.redirect(paymentUrl);
  } catch (err) {
    console.error('Redirect to VNPay error:', err);
    return res.status(500).send('VNPay redirect error');
  }
};

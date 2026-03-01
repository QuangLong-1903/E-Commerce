# VNPay Integration Guide

## ✅ Đã Fix

Các lỗi sau đây đã được sửa:

### 1. **Lỗi Signature (Sai checksum)**
- ❌ Cũ: `vnp_Locale: 'en'` → ✅ Mới: `vnp_Locale: 'vn'`
- ❌ Cũ: `vnp_OrderType: 'billpayment'` → ✅ Mới: `vnp_OrderType: 'other'`
- ❌ Cũ: Encode URI component → ✅ Mới: Plain string format được VNPay yêu cầu

### 2. **IP Address handling**
- ❌ Cũ: Logic phức tạp với IPv6 check → ✅ Mới: Simple regex to strip IPv6 prefix

### 3. **Return URL Config**
- ❌ Cũ: `http://localhost:5000/api/vnpay/vnpay_return` (Backend API)
- ✅ Mới: `http://localhost:3000/checkout/vnpay-return` (Frontend)

> 💡 **Flow update:** the backend now exposes a single redirect endpoint (`GET /api/vnpay/redirect/:orderId`).
> The older `/create_payment_url` POST route has been removed to avoid duplicate flows.

### 4. **Order Creation**
- Thêm page handler `VnpayReturnPage.js` để xử lý VNPay redirect
- Thêm route `/checkout/vnpay-return` trong `App.js`

---

## 🔧 Testing VNPay Locally
> ⚠️ **Important improvements** (already applied in backend code):
>
> 1. Only one payment URL per order — the controller rejects further requests if `vnpayTxnRef` already exists.
> 2. Secret key is never logged (removed from console output).
> 3. IP address is derived dynamically from `x-forwarded-for` / connection, not hard‑coded.
> 4. Return URL defaults to a **backend endpoint** where the hash is verified before redirecting to the frontend.
> 5. IPN handler returns correct VNPay response codes and validates amount/status.

### Bước 1: Verify Environment Variables
```env
# backend/.env
# (replace with your own test account values)
VNP_TMNCODE=AY0K3A0W           # Terminal ID / Mã Website (provided)
VNP_HASHSECRET=ZKIYRPH7JCQXJ4F40ASJ9K1B3HDIA94Q  # Secret Key
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURNURL=http://localhost:3000/checkout/vnpay-return
FRONTEND_URL=http://localhost:3000
```

### Bước 2: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

### Bước 3: Test Payment Flow

1. **Add products to cart** → Go to `/checkout`
2. **Click "💳 Thanh toán qua VNPay"** (this creates the order then redirects to `/api/vnpay/redirect/:orderId`)
   - the server will only generate a txnRef once per order and will reject repeated attempts if the order is already paid
3. **Bạn sẽ được mount tới VNPay sandbox**
4. **Use VNPay test card:**
   - Card: `9704198526191432198`
   - OTP: `123456`
   - Exp: `07/15`

---

## 🐛 Debugging

### 🧾 Merchant admin / SIT test info
- Merchant admin: https://sandbox.vnpayment.vn/merchantv2/
  - username: lequanglong.dev@gmail.com
  - password: (use the password you entered during test registration)
- SIT/IPN test portal: https://sandbox.vnpayment.vn/vnpaygw-sit-testing/user/login
  - username: lequanglong.dev@gmail.com
  - password: (same as above)


### Check Browser Console
```javascript
// Example errors in console:
❌ "Checksum mismatch" → Hash computation wrong
❌ "Error 03" → Merchant config wrong
❌ "Empty cart" → Cart slice issue
```

### Check Backend Logs
```bash
# Run backend with debug logs
NODE_ENV=development npm run dev

# Look for:
🔐 VNPay Params (before sort):
📝 Sign Data:
🔗 URL: https://sandbox.vnpayment.vn/...
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| **Sai checksum** | Hash không match | Verify `VNP_HASHSECRET` chính xác |
| **Error 03** | Merchant không tồn tại / cấu hình sai | Kiểm tra lại `VNP_TMNCODE` và chắc chắn đã đăng ký sandbox/production đúng | 
| **Error 07** | IP address không match | Ensure IP forwarding is correct |
| **Redirection fails** | Return URL không được register | Go to VNPay admin, update Return URL |

> ➤ The backend now returns human‑readable messages for common response codes and logs them. Error 03 will explicitly say the merchant ID is invalid, helping debug signature/merchant problems.

---

## 📝 Hash Calculation (SHA512)

VNPay dùng SHA512 HMAC. Thứ tự **CRITICAL**:

```javascript
1. Sort all parameters by key alphabetically
2. Create query string: key1=value1&key2=value2&...
3. Calculate: HMAC-SHA512(signData, secret)
4. Result: hex string
```

**Code:**
```javascript
const sortedParams = sortObject(vnp_Params); // Sort by key
const signData = querystring.stringify(sortedParams, { encode: false });
const hmac = crypto.createHmac('sha512', vnp_HashSecret);
const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
```

---

## 💳 Production Deployment

Khi deploy lên production:

1. **Update .env**
   ```env
   # Thay đổi:
   VNP_URL=https://api.vnpayment.vn/paymentv2/vpcpay.html
   VNP_RETURNURL=https://yourdomain.com/checkout/vnpay-return
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Register with VNPay**
   - Contact VNPay support
   - Provide: Merchant ID, Hash Secret, Return URLs
   - Get production credentials

3. **Test Payment Flow** on production account

---

## 📞 Contact VNPay Support
- **Email:** support@vnpayment.vn
- **Hotline:** 1800.1234 (Vietnam)
- **Docs:** https://sandbox.vnpayment.vn/apis/docs/

---

## 🎯 Next Steps

1. ✅ Clone fixed code
2. ✅ Test with sandbox credentials
3. ✅ Verify payment flow end-to-end
4. ✅ Check browser console for errors
5. ✅ Review backend logs for hash issues
6. ✅ Contact VNPay if merchant config issues

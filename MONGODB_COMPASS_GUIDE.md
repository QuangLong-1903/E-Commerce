# Hướng dẫn Xem Data MongoDB Compass

## 📋 Tóm Tắt

Hướng dẫn này giúp bạn xem các data được tạo từ ứng dụng web (đăng ký tài khoản, tạo sản phẩm, v.v) trong **MongoDB Compass**.

---

## 📋 Yêu Cầu Trước

✅ MongoDB Desktop đã cài đặt  
✅ Backend server đang chạy (`npm run dev`)  
✅ Frontend server đang chạy  
✅ MongoDB Compass đã cài đặt

---

## 🚀 Các Bước Xem Data

### **Bước 1: Mở MongoDB Compass**

- Tìm và nhấp đúp vào **MongoDB Compass** để mở ứng dụng
- Hoặc chạy từ terminal: `mongodb-compass`

### **Bước 2: Kết Nối tới MongoDB**

**Option 1: Connection String (Khuyến Nghị)**
1. Trong Compass, nhấp vào **"New Connection"**
2. Chọn **"URI"** tab
3. Nhập connection string:
   ```
   mongodb://localhost:27017
   ```
4. Nhấp **"Connect"**

**Option 2: URI trong Compass (Nếu có sẵn)**
- Compass thường tự động kết nối tới `mongodb://localhost:27017` nếu MongoDB chạy locally
- Nếu không, nhấp **"Connect"** để kết nối

### **Bước 3: Chọn Database**

1. Bên cạnh trái, bạn sẽ thấy danh sách databases
2. Tìm và nhấp vào **`ecommerce`** database
   - Đây là database được định nghĩa trong `.env` backend:
     ```
     MONGODB_URI=mongodb://localhost:27017/ecommerce
     ```

### **Bước 4: Chọn Collection**

Database `ecommerce` chứa các collections:

| Collection | Mô Tả |
|-----------|-------|
| **users** | Tất cả tài khoản người dùng |
| **products** | Các sản phẩm trong cửa hàng |
| **categories** | Các danh mục sản phẩm |
| **cart** | Giỏ hàng của người dùng |
| **orders** | Đơn hàng |

**Ví dụ: Xem users**
1. Nhấp vào **`ecommerce`** database
2. Nhấp vào **`users`** collection
3. Bạn sẽ thấy tất cả users được tạo từ web

---

## 📊 Dữ Liệu Được Lưu Trữ

### **Users Collection**

Khi đăng ký tài khoản từ web, dữ liệu được lưu:

```json
{
  "_id": ObjectId("6971b298def89a5d01a5de52"),
  "name": "Compass Test User",
  "email": "compass@test.com",
  "password": "$2a$10$...", // Hashed password (bcryptjs)
  "role": "user",
  "avatar": null,
  "phone": null,
  "address": {},
  "googleId": null,
  "isEmailVerified": false,
  "isActive": true,
  "createdAt": ISODate("2026-01-22T10:30:00.000Z"),
  "updatedAt": ISODate("2026-01-22T10:30:00.000Z"),
  "__v": 0
}
```

### **Products Collection**

Khi tạo sản phẩm từ admin panel:

```json
{
  "_id": ObjectId("..."),
  "name": "Sản phẩm mẫu",
  "slug": "san-pham-mau",
  "description": "Mô tả sản phẩm",
  "price": 99000,
  "stock": 50,
  "category": ObjectId("..."),
  "images": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "...",
      "isMain": true
    }
  ],
  "createdAt": ISODate("2026-01-22T11:00:00.000Z"),
  "updatedAt": ISODate("2026-01-22T11:00:00.000Z")
}
```

### **Orders Collection**

Khi tạo đơn hàng:

```json
{
  "_id": ObjectId("..."),
  "user": ObjectId("..."),
  "orderNumber": "ORD-001",
  "items": [
    {
      "_id": ObjectId("..."),
      "product": ObjectId("..."),
      "name": "Tên sản phẩm",
      "price": 99000,
      "quantity": 2
    }
  ],
  "totalPrice": 198000,
  "paymentStatus": "pending",
  "status": "pending",
  "createdAt": ISODate("2026-01-22T12:00:00.000Z")
}
```

---

## 🔍 Các Tính Năng Sử Dụng Trong Compass

### **1. Tìm Kiếm (Search)**
- Nhấp vào **"Filter"** icon
- Nhập điều kiện tìm kiếm, ví dụ:
  ```json
  { "email": "compass@test.com" }
  ```
- Nhấp **"Apply"**

### **2. Sắp Xếp (Sort)**
- Chọn cột để sắp xếp (A-Z hoặc Z-A)
- Ví dụ: Sắp xếp users theo ngày tạo mới nhất

### **3. Export Data**
- Nhấp **"Export"** nút
- Chọn format: JSON, CSV, v.v
- Chọn thư mục để lưu file

### **4. Xem Chi Tiết Document**
- Nhấp vào một document
- Nhấp icon **"expand"** để xem chi tiết đầy đủ
- Có thể chỉnh sửa trực tiếp trong Compass

---

## ⚙️ Các Lệnh Terminal Hữu Ích

### **Kiểm tra MongoDB Service Chạy**
```powershell
Get-Service MongoDB
# Hoặc
Get-Service MongoDb
```

### **Kiểm tra Port 27017 Mở**
```powershell
netstat -ano | Select-String ":27017"
```

### **Xem Tất Cả Databases**
- Mở Compass → bên cạnh trái sẽ hiển thị danh sách

### **Xóa Tất Cả Data (Nếu cần reset)**
```javascript
// Chạy trong MongoDB shell hoặc Compass
db.users.deleteMany({})
db.products.deleteMany({})
db.categories.deleteMany({})
```

---

## 🐛 Khắc Phục Sự Cố

### **Compass không kết nối**
✅ Kiểm tra MongoDB Desktop đang chạy  
✅ Kiểm tra connection string: `mongodb://localhost:27017`  
✅ Kiểm tra port 27017: `netstat -ano | Select-String ":27017"`  
✅ Restart MongoDB Desktop

### **Không thấy database `ecommerce`**
✅ Mở backend terminal, xác nhận "✅ MongoDB Connected Successfully"  
✅ Chạy một request từ web (đăng ký, tạo sản phẩm)  
✅ Refresh Compass (F5)

### **Data không update trong Compass**
✅ Nhấp **"Refresh"** button (tròn xoay ở góc phải)  
✅ Đóng và mở lại Compass  
✅ Kiểm tra backend logs có lỗi không

---

## 📝 Test Data Mẫu

### **Tạo User Test Qua Web**
1. Truy cập: `http://localhost:3000/register`
2. Nhập thông tin:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test@123456`
3. Nhấp **Create Account**
4. Mở MongoDB Compass → `ecommerce` → `users`
5. Bạn sẽ thấy user mới được tạo

### **Tạo Product Test Qua Admin**
1. Truy cập: `http://localhost:3000/admin/products`
2. Nhấp **Add Product**
3. Nhập thông tin sản phẩm
4. Nhấp **Save**
5. Mở MongoDB Compass → `ecommerce` → `products`
6. Bạn sẽ thấy product mới

---

## 📞 Cấu Hình MongoDB trong Backend

**File: `backend/.env`**
```dotenv
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce
DATABASE_URL=mongodb://localhost:27017/ecommerce
```

**File: `backend/config/db.js`**
```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
```

---

## 🎯 Tóm Tắt Workflow

```
1. Mở Compass
   ↓
2. Kết nối: mongodb://localhost:27017
   ↓
3. Chọn database: ecommerce
   ↓
4. Chọn collection: users, products, orders, v.v
   ↓
5. Xem/tìm kiếm/export data
```

---

## 📚 Tài Liệu Tham Khảo

- [MongoDB Compass Official Guide](https://docs.mongodb.com/compass/)
- [MongoDB Connection String URI](https://docs.mongodb.com/manual/reference/connection-string/)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**✅ Chúc bạn thành công! Nếu có vấn đề, hãy kiểm tra backend logs và MongoDB service.**

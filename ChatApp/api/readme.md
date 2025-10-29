### 1. Chạy Solution

- Mở **solution** bằng **Visual Studio**.
- Nhấn **Run (F5)** hoặc nút **Start** (màu xanh).
- Swagger sẽ hiển thị tại địa chỉ: https://localhost:44330/swagger/index.html


### 2. Cấu hình ConnectionString

- Thay đổi chuỗi kết nối trong file `appsettings.json` tại dự án `WebApplication.API` để phù hợp với cấu hình cơ sở dữ liệu của bạn.

### 3. Đăng nhập và sử dụng API

Sử dụng endpoint sau: POST /api/user/login để đăng nhập và lấy `accessToken`:

####  Dữ liệu gửi lên (Request Body)

```json
{
  "userName": "paic",
  "password": "12345678"
}
```

#### 4. Chạy dự án sử dụng file postman đi kèm để kiểm tra các api, khi login bằng postman thì token đã được tự động gán vào header
 




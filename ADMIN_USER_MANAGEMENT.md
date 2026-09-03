# Quản Lý Người Dùng Admin

Tài liệu này mô tả phần frontend của tab quản lý người dùng trong trang
`/admin/user`.

## Mục Tiêu

Trang quản lý người dùng cho phép admin xem danh sách tài khoản và thao tác
trực tiếp trên bảng mà không chuyển trang:

- Xem chi tiết tài khoản.
- Sửa thông tin tài khoản.
- Xóa tài khoản.
- Lọc theo trạng thái hoạt động và quyền tài khoản.
- Sắp xếp theo họ tên hoặc ngày tạo.

## Luồng Giao Diện

Các nút thao tác nằm trong cột `Thao tác` của từng dòng tài khoản.

### Sửa

Nút `Sửa` mở `Dialog` của shadcn ngay trên trang hiện tại.

Form sửa gồm:

- `Họ tên`
- `Email`
- `Số điện thoại`
- `Vai trò`: `Admin` hoặc `User`
- `Trạng thái`: `Hoạt động` hoặc `Dừng hoạt động`

Khi lưu, frontend gọi:

```http
PATCH /api/user/update/:id
```

Payload gửi lên backend:

```json
{
  "fullName": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0900000000",
  "isadmin": false,
  "status": true
}
```

Trong đó:

- `isadmin = true`: tài khoản admin.
- `isadmin = false`: tài khoản user.
- `status = true`: tài khoản đang hoạt động.
- `status = false`: tài khoản dừng hoạt động.

Sau khi cập nhật thành công, trang gọi `router.refresh()` để tải lại danh
sách người dùng.

### Xóa

Nút `Xóa` mở `AlertDialog` của shadcn để xác nhận trước khi xóa.

Khi xác nhận, frontend gọi:

```http
DELETE /api/user/delete/:id
```

Sau khi xóa thành công, trang gọi `router.refresh()` để cập nhật lại danh
sách.

### Chi Tiết

Nút `Chi tiết` mở `Dialog` của shadcn và gọi API chi tiết tài khoản:

```http
GET /api/user/detail/:id
```

Dialog hiển thị:

- ID
- Họ tên
- Email
- Số điện thoại
- Vai trò
- Trạng thái
- Ngày tạo

## Dữ Liệu Hiển Thị

Danh sách user dùng các field chính:

```ts
type Users = {
  id: string;
  fullname: string;
  phone: string;
  created_at: string;
  isadmin: boolean;
  email: string;
  status?: boolean;
};
```

Lưu ý: frontend coi `status !== false` là `Hoạt động` để tránh dữ liệu cũ
chưa có field `status` bị hiển thị nhầm là dừng hoạt động.

## API Phụ Thuộc

Frontend phụ thuộc backend trả các field sau trong list/detail/create/update:

- `id`
- `fullname`
- `email`
- `phone`
- `isadmin`
- `status`
- `created_at`

Nếu backend chưa trả `status` hoặc database chưa có cột `users.status`, phần
lọc và hiển thị trạng thái sẽ không hoạt động đúng.

## Kiểm Tra

Các regression test liên quan nằm trong:

```bash
test/frontend-structure.test.mjs
```

Lệnh kiểm tra:

```bash
npm test
npm run lint
npm run build
```

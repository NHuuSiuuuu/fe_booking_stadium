# 🏟️ Stadium Booking Platform

Một ứng dụng web hiện đại giúp người dùng tìm kiếm, xem thông tin và đặt sân thể thao trực tuyến một cách nhanh chóng và tiện lợi. Dự án tích hợp các tính năng đặt sân theo thời gian thực, quản lý admin và trải nghiệm người dùng thân thiện trên cả web và mobile.

## ✨ Tính Năng Chính

- Tìm kiếm và xem danh sách sân thể thao theo khu vực, loại sân và từ khóa
- Chọn ngày, khung giờ và thực hiện đặt sân trực tuyến
- Tích hợp giữ slot theo thời gian thực để tránh trùng booking
- Hỗ trợ xem sân trên bản đồ và định vị gần khu vực người dùng
- Quản lý booking, sân và thống kê thông qua giao diện admin
- Hỗ trợ đăng nhập, đăng ký, xem lịch sử đặt sân và thao tác tài khoản

## 🛍️ Khách Hàng

- Dễ dàng tìm kiếm sân phù hợp với nhu cầu
- Xem thông tin chi tiết sân, giá và khung giờ hoạt động
- Đặt sân nhanh chóng chỉ với vài thao tác
- Theo dõi lịch sử booking và trạng thái đặt chỗ

## 👨‍💼 Quản Trị Viên

- Quản lý danh sách sân và thông tin chi tiết sân
- Cập nhật cấu hình giá và khung giờ hoạt động
- Quản lý booking, trạng thái đơn đặt sân và người dùng
- Theo dõi thống kê booking, doanh thu và sân được sử dụng nhiều nhất

## 🛠️ Công Nghệ Sử Dụng

### Core

- Next.js
- React
- TypeScript
- Node.js / Express

### UI/UX

- Tailwind CSS
- Shadcn UI
- Lucide Icons

### State & Data

- React Hook Form
- Zod
- REST API
- Socket.IO

### Utilities

- Leaflet / React Leaflet
- Recharts
- next-themes
- Sonner

### Development Tools

- ESLint
- TypeScript
- PostCSS
- Vercel-ready deployment

## 📁 Cấu Trúc Thư Mục

```bash
app/               # Các route và page theo Next.js App Router
components/       # UI components dùng chung
hooks/            # Custom hooks
lib/              # Tiện ích và helpers
public/           # Static assets
schemaValidations/ # Schema validation bằng Zod
```

## 🚀 Bắt Đầu

### Yêu Cầu

- Node.js 18+
- npm, pnpm hoặc yarn

### Cài Đặt

```bash
npm install
```

Tạo file `.env.local` và cấu hình các biến môi trường sau:

```bash
NEXT_PUBLIC_API_ENDPOINT=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SOCKET_URL=
```

## 📜 Scripts

```bash
npm run dev      # Chạy development server
npm run build    # Build production
npm run start    # Chạy production build
npm run lint     # Chạy ESLint
```

## 🔐 Xác Thực

- Hệ thống xác thực người dùng và admin thông qua backend API
- Sử dụng cookie-based authentication để duy trì phiên đăng nhập

## 🎨 Styling

- Tailwind CSS được dùng để xây dựng giao diện hiện đại và responsive
- Shadcn UI cung cấp các component chuẩn và dễ mở rộng

## 📦 Deployment

Dự án có thể được deploy lên Vercel hoặc bất kỳ nền tảng hosting hỗ trợ Next.js nào.

## 🤝 Đóng Góp

1. Fork repository
2. Tạo branch mới cho tính năng hoặc sửa lỗi
3. Commit thay đổi
4. Mở Pull Request

## 📝 License

Dự án này đang được phát triển cho mục đích học tập và demo.

## 👨‍💻 Tác Giả

- GitHub: [NHuuSiuuuu](https://github.com/NHuuSiuuuu)
- Repository: [Stadium Booking Platform ](https://github.com/NHuuSiuuuu/fe_booking_stadium)

## 🐛 Báo Lỗi

Nếu bạn tìm thấy lỗi, vui lòng tạo issue trên GitHub repository.

## 📞 Liên Hệ

Để biết thêm thông tin, vui lòng liên hệ qua GitHub issues hoặc email.

---

Built with ❤️ using Next.js + TypeScript

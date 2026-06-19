import { z } from "zod";

// Tạo schema (Luật validate) chi biến môi trường
const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_SOCKET_URL: z.string(),
});

// Lấy dữ liệu từ process.env và đem đi validate
const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
});

// Kiểm tra kết quả validate
if (!configProject.success) {
  console.error(configProject.error.issues); // log ra list lỗi (field nào sai, vì sao sai)
  throw new Error("Các giá trị khai báo trong file .env không hợp lệ");
  // Dừng app ngay nếu config sai
}

// Nếu validate thành công
const envConfig = configProject.data;
// data đã đc đảm bảo đúng kiểu + format

export default envConfig;

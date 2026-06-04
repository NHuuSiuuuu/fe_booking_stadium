import { z } from "zod"; // Thư viện tạo schema valide  (luật cho form)

// Register
export const RegisterBody = z
  .object({
    fullName: z.string().trim().min(2, "Họ tên phải ít nhất 2 ký tự").max(256),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().trim().min(10, "Số điện thoại không hợp lệ"),
    password: z.string().min(0, "Mật khẩu tối thiểu 6 ký tự").max(100),
    passwordConfirm: z
      .string()
      .min(0, "Mật khẩu xác nhận tối thiểu 6 ký tự")
      .max(100),
  })
  .strict() // Không cho field lạ ngoài schema

  //   Hàm viết logic cho cả obj: so sánh, tạo lỗi ...(ctx: context: công cụ tạo lỗi, gắn lỗi, báo lỗi)
  .superRefine(({ passwordConfirm, password }, ctx) => {
    if (passwordConfirm != password) {
      ctx.addIssue({
        /**
         * code có các option loại lỗi
         * custom: lỗi tự tạo
         * invalid_type: sai kiểu dữ liệu
         * too_small: quá ngắn
         * too_big: quá dài
         */
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["passwordConfirm"], // chỉ định lỗi thuộc  field nào
      });
    }
  });

// lấy type từ schema
export type RegisterBodyType = z.infer<typeof RegisterBody>;

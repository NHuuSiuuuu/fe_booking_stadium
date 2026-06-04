import ForgotPasswordForm from "@/app/(auth)/forgot-password/forgot-password-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Quyên mật khẩu",
  description: "Trang lấy lại mật khẩu tài khoản",
};


export default function page() {
  return (
    <div>
      <ForgotPasswordForm />
    </div>
  );
}

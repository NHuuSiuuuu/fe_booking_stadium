import LoginForm from "@/app/(auth)/login/login-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Trang đăng nhập",
};

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

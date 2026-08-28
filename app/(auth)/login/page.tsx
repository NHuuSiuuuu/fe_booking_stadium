import LoginForm from "@/app/(auth)/login/login-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Trang đăng nhập",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

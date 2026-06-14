import RegisterForm from "@/app/(auth)/register/register-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Trang đăng ký",
};

export default function page() {
  return <RegisterForm />;
}

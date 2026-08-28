import LoginAdminForm from "@/app/admin/login/login-admin-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  description: "Trang đăng nhập quản trị",
  robots: {
    index: false,
    follow: false,
  },
};

export default function page() {
  return <LoginAdminForm />;
}

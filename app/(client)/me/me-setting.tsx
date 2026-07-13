"use client";
import {
  CreditCard,
  FileText,
  Receipt,
  Wallet,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthUser = {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  isAdmin: boolean;
};

export default function MePage({
  initialUser,
}: {
  initialUser: AuthUser | null;
}) {
  const [activePage, setActivePage] = useState("account");
  const [activeTab, setActiveTab] = useState("info");
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(error);
    }
    router.push("/");
    router.refresh();
  }
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { icon: FileText, label: "Đặt chỗ của tôi", page: "bookings" },
    { icon: Receipt, label: "Danh sách giao dịch", page: "transactions" },
    { icon: Wallet, label: "Thanh toán & Hoàn tiền", page: "refunds" },
    { icon: Settings, label: "Tài khoản", page: "account" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex max-w-5xl gap-6">
        {/* Sidebar */}
        <aside className="h-fit w-64 shrink-0 overflow-hidden  bg-white shadow-sm">
          {/* Profile */}
          <div className="flex items-center gap-3 border-b border-slate-100 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
              {getInitials(initialUser?.fullname || "")}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {initialUser?.fullname || "Người dùng"}
              </p>
              <p className="text-xs text-slate-500">{initialUser?.email}</p>
            </div>
          </div>
          <div className="border-t border-slate-100" />

          {/* Nav */}
          <nav>
            {navItems.map(({ icon: Icon, label, page }) => {
              const isActive = activePage === page;
              return (
                <button
                  key={label}
                  onClick={() => page !== "logout" && setActivePage(page)}
                  className={`flex w-full items-center gap-3 px-5 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-[#001A2D] text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-700"}`}
                  />
                  {label}
                </button>
              );
            })}
            <button
              className={`flex w-full items-center gap-3 px-5 py-3 text-sm transition-colors 
               
               text-slate-700 hover:bg-slate-50 
              `}
              onClick={handleLogout}
            >
              <Settings className={`h-4 w-4 `} />
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {activePage == "account" && (
            <>
              <h1 className="mb-4 text-2xl font-bold text-slate-900">
                Cài đặt
              </h1>

              {/* Tabs */}
              <div className="mb-4 flex gap-6 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`relative pb-3 text-sm font-medium ${
                    activeTab === "info" ? "text-[#0F172B]" : "text-slate-400"
                  }`}
                >
                  Thông tin tài khoản
                  {activeTab === "info" && (
                    <span className="absolute -bottom-px left-0 h-0.5 w-full bg-[#001A2D]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`relative pb-3 text-sm font-medium ${
                    activeTab === "security"
                      ? "text-[#0F172B]"
                      : "text-slate-400"
                  }`}
                >
                  Mật khẩu & Bảo mật
                  {activeTab === "security" && (
                    <span className="absolute -bottom-px left-0 h-0.5 w-full bg-[#001A2D]" />
                  )}
                </button>
              </div>

              {/* Form card */}
              <div className=" bg-white p-6 shadow-sm">
                {activeTab === "info" ? (
                  <>
                    <h2 className="mb-5 text-base font-semibold text-slate-900">
                      Dữ liệu cá nhân
                    </h2>

                    {/* Full name */}
                    <div className="mb-5">
                      <label className="mb-1.5 block text-sm text-slate-600">
                        Tên đầy đủ
                      </label>
                      <input
                        type="text"
                        defaultValue={initialUser?.fullname || ""}
                        className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                      <p className="mt-1.5 text-xs text-slate-400">
                        Tên trong hồ sơ được rút ngắn từ họ tên của bạn.
                      </p>
                    </div>

                    {/* City */}
                    <div className="mb-6">
                      <label className="mb-1.5 block text-sm text-slate-600">
                        Thành phố cư trú
                      </label>
                      <input
                        type="text"
                        placeholder="Thành phố cư trú"
                        className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-400 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                      <button className=" bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-400">
                        Có lẽ để sau
                      </button>
                      <button className=" bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-400">
                        Lưu
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-5 text-base font-semibold text-slate-900">
                      Đổi mật khẩu
                    </h2>

                    {/* Current password */}
                    <div className="mb-5">
                      <label className="mb-1.5 block text-sm text-slate-600">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {/* New password */}
                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm text-slate-600">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          placeholder="Nhập mật khẩu mới"
                          className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-slate-600">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          placeholder="Nhập lại mật khẩu mới"
                          className="w-full  border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-300 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div className="mb-6 border-t border-slate-100 pt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Xác thực 2 lớp
                          </p>
                          <p className="text-xs text-slate-400">
                            Tăng bảo mật cho tài khoản bằng mã xác thực khi đăng
                            nhập.
                          </p>
                        </div>
                        <button className="relative h-6 w-11 rounded-full bg-slate-200 transition-colors">
                          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                      <button className=" bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-400">
                        Hủy
                      </button>
                      <button className=" bg-[#001A2D] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600">
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

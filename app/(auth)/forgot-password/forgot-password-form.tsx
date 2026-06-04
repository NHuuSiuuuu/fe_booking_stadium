"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mail, KeyRound, Lock, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
  const router = useRouter();
  // Step 1: Nhập email - Step 2: Nhập OTP + pw
  const [step, setStep] = useState(1);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resetting, setResetting] = useState(false);

  //   Countdown để gửi lại OTP
  const [countdown, setCountdown] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  //   Hàm gửi OTP
  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    setSendingOtp(true);

    try {
      const res = await fetch("api/user/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Lỗi");
      toast.success("Đã gửi mã OTP");
      setStep(2);
      setCountdown(60);
    } catch (error) {
      console.error(error);
    } finally {
      setSendingOtp(false);
    }
  };

  //   Hàm gửi OTP
  const handleResetPassword = async (e: any) => {
    e.preventDefault();
    setResetting(true);

    try {
      const res = await fetch("api/user/password/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Lỗi");
      toast.success("Đổi mật khẩu thành công");

      setFormData({ email: "", otp: "", newPassword: "" });
      router.push("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] shrink-0 bg-black px-12 py-14">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="flex items-center justify-center w-10 h-10 border-2 border-white">
            <span className="text-xs font-black tracking-widest text-white uppercase">
              SB
            </span>
          </div>
          <span className="text-sm font-black tracking-widest text-white uppercase">
            SânBóngHN
          </span>
        </Link>

        <div>
          <p className="mb-4 text-5xl font-black leading-none tracking-tight text-white uppercase">
            NHANH
            <br />
            <span className="text-gray-500">NHẤT</span>
            <br />
            HÀ NỘI.
          </p>
          <p className="mt-6 text-xs tracking-widest text-gray-500 uppercase">
            Xem lịch trống · Đặt sân online · Bản đồ GIS trực quan
          </p>
        </div>

        <p className="text-gray-600 text-[11px] uppercase tracking-widest">
          © 2026 SânBóngHN
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col justify-center px-10 py-12 max-w-[480px] mx-auto w-full">
        {/* Mobile logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mb-10 no-underline lg:hidden"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-black">
            <span className="text-white font-black text-[10px] uppercase tracking-widest">
              SB
            </span>
          </div>
          <span className="text-sm font-black tracking-widest text-black uppercase">
            SânBóngHN
          </span>
        </Link>

        {/* Step indicator */}
        <div className="flex items-center mb-10">
          {["Nhập email", "Đặt lại mật khẩu"].map((label, i) => {
            const current = i + 1;
            const done = step > current;
            const active = step === current;
            return (
              <div key={label} className="flex items-center">
                {i > 0 && (
                  <div
                    className={`w-10 h-0.5 ${done ? "bg-black" : "bg-gray-300"}`}
                  />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-black ${active || done ? "bg-black text-white" : "border-2 border-gray-300 text-gray-400"}`}
                  >
                    {current}
                  </div>
                  <span
                    className={`text-[11px] uppercase tracking-widest font-bold ${active ? "text-black" : "text-gray-400"}`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-3">
              Bước 1
            </p>
            <h1 className="mb-1 text-3xl font-black tracking-tight text-black uppercase">
              Quên mật khẩu
            </h1>
            <p className="mb-10 text-xs tracking-widest text-gray-400 uppercase">
              Nhập email để nhận mã OTP
            </p>

            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  <Mail size={11} /> Email
                </label>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="px-4 py-3 text-sm text-black transition-colors bg-white border border-gray-300 outline-none focus:border-black placeholder:text-gray-400"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={sendingOtp}
                className="flex items-center justify-center w-full gap-2 py-4 mt-2 text-xs font-black tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-900 disabled:opacity-50"
              >
                {sendingOtp ? (
                  "Đang gửi..."
                ) : (
                  <>
                    <span>Gửi mã OTP</span> <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-8">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] uppercase tracking-widest text-gray-400">
                hoặc
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-xs tracking-widest text-gray-400 uppercase">
              Nhớ mật khẩu rồi?{" "}
              <Link
                href="/login"
                className="pb-px font-bold text-black no-underline transition-colors border-b border-black hover:text-gray-600 hover:border-gray-600"
              >
                Đăng nhập
              </Link>
            </p>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <>
            <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-3">
              Bước 2
            </p>
            <h1 className="mb-1 text-3xl font-black tracking-tight text-black uppercase">
              Đặt lại mật khẩu
            </h1>
            <p className="mb-10 text-xs tracking-widest text-gray-400 uppercase">
              Mã OTP đã gửi đến{" "}
              <span className="font-bold text-black">{formData?.email}</span>
            </p>

            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  <KeyRound size={11} /> Mã OTP
                </label>
                <input
                  type="text"
                  placeholder="Nhập mã OTP"
                  className="px-4 py-3 text-sm tracking-widest text-black transition-colors bg-white border border-gray-300 outline-none focus:border-black placeholder:text-gray-400"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  <Lock size={11} /> Mật khẩu mới
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  className="px-4 py-3 text-sm text-black transition-colors bg-white border border-gray-300 outline-none focus:border-black placeholder:text-gray-400"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={resetting}
                className="flex items-center justify-center w-full gap-2 py-4 mt-2 text-xs font-black tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-900 disabled:opacity-50"
              >
                {resetting ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    <span>Đổi mật khẩu</span> <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              {countdown > 0 ? (
                <p className="text-xs tracking-widest text-gray-400 uppercase">
                  Gửi lại mã sau{" "}
                  <span className="font-black text-black">{countdown}s</span>
                </p>
              ) : (
                <button
                  disabled={sendingOtp}
                  onClick={(e) => handleSendOtp(e)}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-black hover:text-gray-600 transition-colors"
                >
                  <RotateCcw size={12} />
                  Gửi lại OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

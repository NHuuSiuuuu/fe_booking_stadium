"use client";

import Link from "next/link";
import * as z from "zod";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginBody = z
  .object({
    email: z.string().email("Email là bắt buộc"),
    password: z.string().min(0, "Mật khẩu tối thiểu 6 ký tự").max(100),
  })
  .strict();

type LoginBodyType = z.TypeOf<typeof LoginBody>;

export default function LoginForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    try {
      setIsPending(true);
      const result = await fetch(`api/login`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const payload = await result.json();

      if (!result.ok) {
        throw payload;
      }
      toast.success("Đăng nhập thành công", { position: "top-right" });

      router.replace("/");
      return payload;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* ── Left panel ── */}
      <div
        className={`hidden lg:flex flex-col justify-between w-[42%] shrink-0  px-12 py-14`}
        style={{
          backgroundImage: "url('/hero.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <p className="mb-4 text-5xl font-black leading-15 tracking-tight text-white uppercase">
            Đặt sân bóng
            <br />
            <span className="text-gray-500">Tại</span>
            <br />
            HÀ NỘI.
          </p>
        </div>
      </div>

      {/* ── Right  */}
      <div className="flex-1 flex flex-col justify-center px-10 py-12 max-w-[480px] mx-auto w-full">
        {/* Mobile logo */}
        <Link
          href="/"
          className="flex items-center gap-2 mb-10 no-underline lg:hidden"
        >
          <div className="flex items-center justify-center w-8 h-8 ">
            <img src="/logo.png" alt="" className="" />
          </div>
          <span className="text-sm font-black tracking-widest text-black uppercase">
            SânBóngHN
          </span>
        </Link>

        <p className="text-[11px] uppercase tracking-widest text-[#1b1b1b] mb-3">
          Tài khoản
        </p>
        <h1 className="mb-1 text-3xl font-black tracking-tight text-black uppercase">
          Đăng nhập
        </h1>
        <p className="mb-10 text-xs tracking-widest text-[#1b1b1b] uppercase">
          Chào mừng trở lại
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <Mail size={11} /> Email
            </label>
            <input
              type="email"
              placeholder="Nhập email"
              {...register("email")}
              className="px-4 py-3 text-sm text-black transition-colors bg-white border border-gray-300 outline-none focus:border-black placeholder:text-[#1b1b1b]"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
              <Lock size={11} /> Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password")}
              className="px-4 py-3 text-sm text-black transition-colors bg-white border border-gray-300 outline-none focus:border-black placeholder:text-[#1b1b1b]"
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-1">
            <Link
              href="/forgot-password"
              className="text-[11px] uppercase tracking-widest text-[#1b1b1b] hover:text-black transition-colors no-underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit */}
          <button
            disabled={isPending}
            className="flex items-center justify-center w-full gap-2 py-4 mt-2 text-xs font-black tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-900 disabled:opacity-50"
          >
            {isPending ? (
              "Đang đăng nhập..."
            ) : (
              <>
                Đăng nhập <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[11px] uppercase tracking-widest text-[#1b1b1b]">
            hoặc
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Register */}
        <p className="text-xs tracking-widest text-[#1b1b1b] uppercase">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="pb-px font-bold text-black no-underline transition-colors border-b border-black hover:text-gray-600 hover:border-gray-600"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

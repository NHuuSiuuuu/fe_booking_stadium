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

export default function LoginAdminForm() {
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
      const result = await fetch(`/api/login`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const payload = await res.json();

        if (!res.ok) {
          throw payload;
        }
        toast.success("Đăng nhập thành công", { position: "top-right" });

        router.replace("/admin");
        return payload;
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* ── Right form panel ── */}
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
          Đăng nhập ADMIN
        </h1>

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

          {/* Submit */}
          <button
            // disabled={isPending}
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
      </div>
    </div>
  );
}

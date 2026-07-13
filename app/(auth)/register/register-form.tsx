"use client";

import Link from "next/link";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const fields = [
  {
    key: "fullName",
    label: "Họ và tên",
    type: "text",
    icon: <User size={11} />,
    placeholder: "Nhập họ và tên",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    icon: <Mail size={11} />,
    placeholder: "Nhập email",
  },
  {
    key: "phone",
    label: "Số điện thoại",
    type: "tel",
    icon: <Phone size={11} />,
    placeholder: "Nhập số điện thoại",
  },
  {
    key: "password",
    label: "Mật khẩu",
    type: "password",
    icon: <Lock size={11} />,
    placeholder: "Nhập mật khẩu",
  },
  {
    key: "passwordConfirm",
    label: "Nhập lại mật khẩu",
    type: "password",
    icon: <Lock size={11} />,
    placeholder: "Nhập lại mật khẩu",
  },
] as const;

export default function RegisterForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleRegister = async (values: RegisterBodyType) => {
    setIsPending(true);
    try {
      const result = await fetch(`api/user/create`, {
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
      toast.success(payload?.message, { position: "top-right" });
      router.replace("/login");
    } catch (error: any) {
      toast.error(error.message, { position: "top-right" });
    } finally {
      setIsPending(false);
    }
  };

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

      {/* ── Right form panel ── */}
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

        <p className="text-[11px] uppercase tracking-widest text-[#1b1b1b] mb-3">
          Tài khoản
        </p>
        <h1 className="mb-1 text-3xl font-black tracking-tight text-black uppercase">
          Đăng ký
        </h1>
        <p className="mb-10 text-xs tracking-widest text-[#1b1b1b] uppercase">
          Tạo tài khoản để đặt sân nhanh hơn
        </p>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="flex flex-col gap-4"
        >
          {fields.map(({ key, label, type, icon, placeholder }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                {icon} {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                {...register(key)}
                className="px-4 py-3 text-sm text-black transition-colors bg-white border border-gray-300 outline-none focus:border-black placeholder:text-[#1b1b1b]"
              />
              {errors[key] && (
                <span className="text-red-500">{errors[key]?.message}</span>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center w-full gap-2 py-4 mt-2 text-xs font-black tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-900 disabled:opacity-50"
          >
            {isPending ? (
              "Đang tạo..."
            ) : (
              <>
                {" "}
                Tạo tài khoản <ArrowRight size={14} />
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

        <p className="text-xs tracking-widest text-[#1b1b1b] uppercase">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="pb-px font-bold text-black no-underline transition-colors border-b border-black hover:text-gray-600 hover:border-gray-600"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

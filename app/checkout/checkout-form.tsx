"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Banknote,
  CreditCard,
  ArrowLeft,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Tag,
} from "lucide-react";
type Stadium = {
  id: number;
  name: string;
  address: string;
  type: number;
  thumbnail: string[];
};
type Slot = {
  id: number;
  start_time: string;
  end_time: string;
  price: number;
};
type User = {
  id: number;
  fullname: string;
  email: string;
  phone?: string;
};

type CheckoutData = {
  slug: string;
  slot: Slot;
  date: string;
  user: User | null;
};

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  note: string;
};

type PaymentMethod = "cash" | "online";

export default function CheckoutForm() {
  const router = useRouter();
  const [data, setData] = useState<CheckoutData | null>(null);
  const [stadium, setStadium] = useState<Stadium | null>(null);
  const [isSubmitting, setISubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("checkoutData");
      if (!raw) {
        router.replace("/");
        return;
      }

      setData(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Load sân
  useEffect(() => {
    if (!data?.slug) return;
    setIsLoading(true);

    fetch(`/api/stadium/${data?.slug}`)
      .then((r) => r.json())
      .then((data) => setStadium(data[0] ?? null))
      .catch(() => {
        console.error;
        setStadium(null);
      })
      .finally(() => setIsLoading(false));
  }, [data?.slug]);

  const dateObj = new Date(data?.date ?? ""); // bên bên trái null/und thì lấy bên phải

  useEffect(() => {
    if (data?.user) {
      setFormData({
        fullName: data.user.fullname || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        note: "",
      });
    }
  }, [data]);

  const handleOnChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, // kiểu event xảy ra khi input thay đổi: từ input, từ textare
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log("form data", formData);
  const handleConfirm = async () => {
    if (!data?.user) {
      toast.error("Vui lòng đăng nhập để đặt sân", { position: "top-right" });
      router.push("/login");
      return;
    }

    if (!stadium) {
      toast.error("Không tìm thấy sân", { position: "top-right" });
      return;
    }
    if (!dateObj) {
      toast.error("Ngày đặt sân không hợp lệ", { position: "top-right" });
      return;
    }

    try {
      setISubmitting(true);
      const res = await fetch(`api/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          booking_date: dateObj.toISOString().split("T")[0],
          stadium_id: stadium.id,
          price_config_id: data.slot.id,
          paymentMethod: paymentMethod,
          fullName: formData.fullName ?? "",
          email: formData.email ?? "",
          phone: formData.phone ?? "",
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message || "Đặt sân thất bại");
      }

      sessionStorage.removeItem("checkoutData");

      if (result.payment_method === "online") {
        window.location.href = result.vnpayResponse;
        return;
      }

      toast.success("Đặt sân thành công", { position: "top-right" });
      router.push(`/booking/success/${result.booking.id}`);
      console.log("result", result);
      console.log("res", res);
    } catch (err: any) {
      toast.error(err.message, { position: "top-right" });
    } finally {
      setISubmitting(false);
    }
  };

  console.log("paymentMethod", paymentMethod);
  if (!data || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400 animate-pulse">
          Đang tải...
        </p>
      </div>
    );
  }

  if (!stadium) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Không tìm thấy sân
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-6xl px-6 py-10 mx-auto">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Quay lại
        </button>

        <h1 className="mb-8 text-3xl font-bold tracking-tight text-black uppercase">
          Thanh toán đặt sân
        </h1>

        <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {/* Stadium info */}
            <div className="bg-white border border-gray-200">
              <div className="px-5 py-3 bg-black">
                <p className="text-xs font-bold tracking-widest text-white uppercase">
                  Thông tin đặt sân
                </p>
              </div>
              <div className="flex items-start gap-4 p-5">
                <img
                  src={stadium.thumbnail[0]}
                  alt={stadium.name}
                  className="object-cover w-24 h-24 shrink-0 grayscale"
                />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-base font-bold tracking-tight text-black uppercase">
                      {stadium.name}
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">
                      Sân {stadium.type}
                    </span>
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider mb-1">
                    <MapPin size={11} />
                    {stadium.address}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wider mb-3">
                    <Calendar size={11} />
                    {new Date(dateObj).toLocaleDateString("vi-VN")}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest border border-black px-3 py-1 text-black">
                    <Clock size={11} />
                    {data.slot.start_time} — {data.slot.end_time}
                  </span>
                </div>
              </div>
            </div>

            {/* Person info */}
            <div className="bg-white border border-gray-200">
              <div className="px-5 py-3 bg-black">
                <p className="text-xs font-bold tracking-widest text-white uppercase">
                  Thông tin người đặt
                </p>
              </div>
              {data.user ? (
                <div className="grid grid-cols-2 gap-4 p-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      <User size={11} />
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleOnChange}
                      placeholder="Nhập họ và tên"
                      className="border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black transition-colors bg-gray-50 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      <Mail size={11} />
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleOnChange}
                      placeholder="Nhập email"
                      className="border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black transition-colors bg-gray-50 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      <Phone size={11} />
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleOnChange}
                      placeholder="Nhập số điện thoại"
                      className="border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black transition-colors bg-gray-50 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                      <MessageSquare size={11} />
                      Ghi chú
                    </label>
                    <textarea
                      name="note"
                      onChange={handleOnChange}
                      placeholder="Ghi chú thêm (không bắt buộc)"
                      rows={3}
                      className="border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black transition-colors bg-gray-50 resize-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Chưa đăng nhập</p>
                  <Link
                    href="/login"
                    className="text-[11px] font-black uppercase tracking-widest text-black border-b border-black hover:text-gray-600 transition-colors"
                  >
                    Đăng nhập →
                  </Link>
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white border border-gray-200">
              <div className="px-5 py-3 bg-black">
                <p className="text-xs font-bold tracking-widest text-white uppercase">
                  Phương thức thanh toán
                </p>
              </div>
              <div className="flex flex-col gap-3 p-5">
                <label
                  className={`flex items-center gap-3 px-4 py-3.5 border-2 cursor-pointer transition-all ${paymentMethod === "cash" ? "border-black bg-black" : "border-gray-200 hover:border-gray-400"}`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  <div
                    className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${paymentMethod === "cash" ? "border-white" : "border-gray-400"}`}
                  >
                    {paymentMethod === "cash" && (
                      <div className="w-2 h-2 bg-white" />
                    )}
                  </div>
                  <Banknote
                    size={16}
                    className={
                      paymentMethod === "cash" ? "text-white" : "text-gray-500"
                    }
                  />
                  <span
                    className={`text-sm font-bold uppercase tracking-widest ${paymentMethod === "cash" ? "text-white" : "text-gray-700"}`}
                  >
                    Thanh toán tại sân
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 px-4 py-3.5 border-2 cursor-pointer transition-all ${paymentMethod === "online" ? "border-black bg-black" : "border-gray-200 hover:border-gray-400"}`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <div
                    className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${paymentMethod === "online" ? "border-white" : "border-gray-400"}`}
                  >
                    {paymentMethod === "online" && (
                      <div className="w-2 h-2 bg-white" />
                    )}
                  </div>
                  <CreditCard
                    size={16}
                    className={
                      paymentMethod === "online"
                        ? "text-white"
                        : "text-gray-500"
                    }
                  />
                  <span
                    className={`text-sm font-bold uppercase tracking-widest ${paymentMethod === "online" ? "text-white" : "text-gray-700"}`}
                  >
                    Thanh toán online
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="sticky lg:col-span-1 top-6">
            <div className="bg-white border border-gray-200">
              <div className="px-5 py-3 bg-black">
                <p className="text-xs font-bold tracking-widest text-white uppercase">
                  Tóm tắt đơn hàng
                </p>
              </div>

              <div className="p-5">
                {/* Stadium mini */}
                <div className="flex items-start gap-3 mb-5">
                  <img
                    src={stadium.thumbnail[0]}
                    alt=""
                    className="object-cover w-14 h-14 shrink-0 grayscale"
                  />
                  <div>
                    <p className="text-sm font-bold tracking-tight text-black uppercase">
                      {stadium.name}
                    </p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest mt-0.5">
                      Sân {stadium.type}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {data.slot.start_time} — {data.slot.end_time}
                    </p>
                  </div>
                </div>

                <div className="h-px mb-4 bg-gray-200" />

                {/* Coupon */}
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                  <Tag size={11} />
                  Mã giảm giá
                </p>
                <div className="flex mb-5">
                  <input
                    // value={coupon}
                    // onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-3 py-2 text-xs tracking-widest uppercase transition-colors border border-r-0 border-gray-300 outline-none focus:border-black placeholder:normal-case placeholder:tracking-normal placeholder:text-gray-400 bg-gray-50"
                  />
                  <button className="px-4 py-2 text-xs font-bold tracking-widest text-white uppercase transition-colors bg-black hover:bg-gray-800 whitespace-nowrap">
                    Áp dụng
                  </button>
                </div>

                <div className="h-px mb-4 bg-gray-200" />

                {/* Price */}
                <div className="space-y-2.5 mb-4">
                  <div className="flex justify-between">
                    <span className="text-xs tracking-widest text-gray-500 uppercase">
                      Tạm tính
                    </span>
                    <span className="text-sm text-gray-700">
                      {new Intl.NumberFormat("vi-VN").format(data.slot.price)}đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs tracking-widest text-gray-500 uppercase">
                      Phí dịch vụ
                    </span>
                    <span className="text-sm font-semibold ">Miễn phí</span>
                  </div>
                </div>

                <div className="h-px mb-4 bg-gray-200" />

                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold tracking-widest text-black uppercase">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-bold text-black">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(data.slot.price)}
                  </span>
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting || !data.user}
                  className="w-full py-4 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : paymentMethod === "online"
                      ? "Thanh toán qua online →"
                      : "Xác nhận đặt sân →"}
                </button>

                {!data.user && (
                  <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-3">
                    Cần đăng nhập để đặt sân
                  </p>
                )}

                <p className="mt-3 text-[10px] text-center text-gray-400 uppercase tracking-widest">
                  Đồng ý với{" "}
                  <span className="underline transition-colors cursor-pointer hover:text-black">
                    điều khoản dịch vụ
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

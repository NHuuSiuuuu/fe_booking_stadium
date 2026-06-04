import CheckoutForm from "@/app/checkout/checkout-form";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Trang thanh toán đặt sân bóng",
};

export default function page() {
  return (
    <div>
      <CheckoutForm />
    </div>
  );
}

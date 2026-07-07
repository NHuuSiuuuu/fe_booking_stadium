import { SquareCheckBig } from "lucide-react";

export default function PaymentSummary({ booking }) {
  return (
    <div className="border border-gray-200">
      <div className="px-5 py-3 bg-black">
        <p className="text-sm font-medium  text-white uppercase">
          Tổng thanh toán
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-[50%] bg-white p-5 space-y-3">
          <div className="flex justify-between">
            <span className="text-sm  text-[#1b1b1b] uppercase">Tạm tính</span>
            <span className="text-sm text-gray-700">
              {new Intl.NumberFormat("vi-VN").format(booking?.total_price)}đ
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm  text-[#1b1b1b] uppercase">Giảm giá</span>
            <span className="text-sm text-gray-700">
              -{new Intl.NumberFormat("vi-VN").format(0)}đ
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm font-medium  text-black uppercase">
              Tổng tiền
            </span>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-medium text-black">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(booking?.total_price)}
              </span>
              <span
                className={`${
                  booking?.payment_method === "online" &&
                  booking?.payment_status === "paid"
                    ? "block"
                    : "hidden"
                } text-[10px] font-medium uppercase  bg-black text-white px-2 py-1`}
              >
                Đã thanh toán
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full md:w-[50%] bg-[#FEFBEE] items-center gap-4 px-6 py-5 border-t md:border-t-0 md:border-l border-gray-200">
          <div className="flex items-center justify-center shrink-0 w-10 h-10 bg-[#FECC06] rounded-full">
            <SquareCheckBig className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="text-sm font-medium  text-black uppercase">
              Cảm ơn bạn!
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Đơn đặt sân của bạn đang chờ xác nhận từ quản lý sân.
            </p>
            <p className="text-xs leading-relaxed text-gray-500">
              Bạn sẽ nhận được thông báo khi đơn được xác nhận.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

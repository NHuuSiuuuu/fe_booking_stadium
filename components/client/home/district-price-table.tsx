"use client";

import { useState } from "react";

const data = [
  { district: "Cầu Giấy", field5: 180000, field7: 230000, field11: 380000 },
  { district: "Hoàng Mai", field5: 170000, field7: 220000, field11: 350000 },
  { district: "Nam Từ Liêm", field5: 190000, field7: 250000, field11: 400000 },
  { district: "Thanh Xuân", field5: 175000, field7: 225000, field11: 360000 },
  { district: "Ba Đình", field5: 185000, field7: 240000, field11: 390000 },
  { district: "Đống Đa", field5: 180000, field7: 235000, field11: 385000 },
  { district: "Hai Bà Trưng", field5: 190000, field7: 245000, field11: 395000 },
  { district: "Long Biên", field5: 160000, field7: 210000, field11: 340000 },
  { district: "Tây Hồ", field5: 200000, field7: 260000, field11: 420000 },
  { district: "Hoàn Kiếm", field5: 220000, field7: 280000, field11: 450000 },
  { district: "Hà Đông", field5: 165000, field7: 215000, field11: 345000 },
  { district: "Gia Lâm", field5: 155000, field7: 205000, field11: 330000 },
  { district: "Thanh Trì", field5: 150000, field7: 200000, field11: 320000 },
];

export default function DistrictPriceTable() {
  const [show, setShow] = useState(false);

  const displayData = show ? data : data.slice(0, 6);

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-10 sm:px-6">
      <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
        Tham khảo
      </p>
      <p className="text-[20px] font-bold mb-[2px] text-[#0f172a] ">
        Bảng Giá Trung Bình Theo Quận
      </p>
      <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
        Cập nhật tháng 06/2026
      </p>

      {/* Desktop */}
      <div className="overflow-hidden  hidden md:block ">
        <table className="w-full">
          <thead>
            <tr
              className="bg-[#0f172a]
            "
            >
              <th className="px-5 py-4 text-left text-sm font-bold  uppercase tracking-wider text-slate-100">
                Quận
              </th>

              <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wider text-slate-100">
                Sân 5
              </th>

              <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wider text-slate-100">
                Sân 7
              </th>

              <th className="px-5 py-4 text-center text-sm font-bold uppercase tracking-wider text-slate-100">
                Sân 11
              </th>
            </tr>
          </thead>

          <tbody>
            {displayData.map((item) => (
              <tr
                key={item.district}
                className=" group uppercase hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4 relative">
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-slate-900 
                  scale-y-0 group-hover:scale-y-100 
                  transition-transform duration-100 origin-center"
                  />
                  <span className="text-[13px] font-black uppercase tracking-wide text-slate-800">
                    {item.district}
                  </span>
                </td>

                <td className="px-5 py-4 text-center font-bold text-slate-900">
                  {item.field5.toLocaleString("vi-VN")}đ
                </td>

                <td className="px-5 py-4 text-center font-bold text-slate-900">
                  {item.field7.toLocaleString("vi-VN")}đ
                </td>

                <td className="px-5 py-4 text-center font-bold text-slate-900">
                  {item.field11.toLocaleString("vi-VN")}đ
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="bg-slate-50 border-t border-slate-200 group">
              <td
                colSpan={4}
                className="px-6 py-2.5 text-sm text-slate-900 font-medium group-hover:border-l-slate-900"
              >
                * Giá tham khảo · Liên hệ từng sân để biết giá chính xác theo
                giờ cao / thấp điểm
              </td>
            </tr>
          </tfoot>
        </table>

        {data.length > 6 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShow(!show)}
              className=" bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 text-xs font-bold  uppercase tracking-widest transition-colors
              "
            >
              {show ? "Thu gọn" : `Xem thêm ${data.length - 6} quận`}
            </button>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-2">
        {displayData.map((item) => (
          <div
            key={item.district}
            className="bg-white border border-slate-200 overflow-hidden"
          >
            {/* Tên quận — header tối */}
            <div className="bg-[#0f172a] px-4 py-2.5 flex items-center gap-2">
              <div className="w-1 h-4 bg-slate-500 shrink-0" />
              <span className="text-[12px] font-black uppercase  text-white">
                {item.district}
              </span>
            </div>

            {/* Giá 3 cột */}
            <div className="grid grid-cols-3 divide-x divide-slate-100">
              <div className="px-3 py-3 text-center">
                <div className="text-xs font-extrabold uppercase  text-slate-900 mb-1.5">
                  Sân 5
                </div>
                <div className="text-[13px] font-bold text-slate-900">
                  {item.field5.toLocaleString("vi-VN")}đ
                </div>
              </div>
              <div className="px-3 py-3 text-center">
                <div className="text-xs font-extrabold uppercase  text-slate-900 mb-1.5">
                  Sân 7
                </div>
                <div className="text-[13px] font-bold text-slate-900">
                  {item.field7.toLocaleString("vi-VN")}đ
                </div>
              </div>
              <div className="px-3 py-3 text-center">
                <div className="text-xs font-extrabold uppercase  text-slate-900 mb-1.5">
                  Sân 11
                </div>
                <div className="text-[13px] font-bold text-slate-900">
                  {item.field11.toLocaleString("vi-VN")}đ
                </div>
              </div>
            </div>
          </div>
        ))}
        {data.length > 6 && (
          <button
            onClick={() => setShow(!show)}
            className=" w-full border  border-slate-200 py-2 text-xs font-bold uppercase tracking-widest  hover:bg-slate-50 transition-colors
            "
          >
            {show ? "Thu gọn" : `Xem thêm ${data.length - 6} quận`}
          </button>
        )}

        <p className="text-[10px] text-slate-500 pt-1">
          * Giá tham khảo · Liên hệ sân để biết giá theo giờ cao điểm
        </p>
      </div>
    </section>
  );
}

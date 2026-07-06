import { X } from "lucide-react";
import React from "react";

export default function ConfirmDeleteDialog({
  confirmDeleteOpen,
  setConfirmDeleteOpen,
  handleDeleteReview
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center transition-opacity duration-300 justify-center px-4 ${
        confirmDeleteOpen
          ? "pointer-events-auto opacity-100 "
          : "pointer-events-none opacity-0 "
      }`}
    >
      <div
        onClick={() => setConfirmDeleteOpen(false)}
        className="absolute inset-0 bg-black/50"
      />

      <div className="relative w-full max-w-sm bg-white border border-gray-200">
        <div className="flex items-center justify-between px-5 py-3 bg-black">
          <p className="text-sm font-medium  text-white uppercase">
            Xác nhận xóa
          </p>
          <button
            onClick={() => setConfirmDeleteOpen(false)}
            className="text-white transition-opacity hover:opacity-70"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm text-gray-700">
            Bạn có chắc muốn xóa đánh giá này không? Hành động này không thể
            hoàn tác.
          </p>
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setConfirmDeleteOpen(false)}
              className="flex-1 py-3 text-sm font-medium  text-black uppercase transition-all border-2 border-black hover:bg-black hover:text-white"
            >
              Huỷ
            </button>
            <button
              onClick={handleDeleteReview}
              className="flex-1 py-3 text-sm font-medium  uppercase transition-colors bg-red-600 text-white hover:bg-red-700"
            >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

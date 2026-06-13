"use client";

import envConfig from "@/config";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  Loader2,
  SquareArrowOutDownRight,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type PriceConfig = {
  id: number;
  stadium_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  price: number;
};

type Slot = {
  start_time: string;
  end_time: string;
  price: number;
};
const DAY_MAP: Record<number, string> = {
  0: "Chủ nhật",
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
};
export default function PriceConfigDetail() {
  const params = useParams();
  const id = params.id;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPiceConfig, setSelectedPriceConfig] =
    useState<PriceConfig | null>(null);
  const [data, setData] = useState<PriceConfig[]>([]);
  console.log("selectedPiceConfig", selectedPiceConfig);
  const [formData, setFormData] = useState({
    stadium_id: id,
    day_of_week: "",
    slots: [
      {
        start_time: "",
        end_time: "",
        price: "",
      },
    ],
  });
  useEffect(() => {
    const fetchPriceConfig = async () => {
      const res = await fetch(
        `${envConfig.NEXT_PUBLIC_APP_URL}/price-config/${id}`,
      );
      if (!res.ok) {
        throw new Error("Lỗi!");
      }

      const result = await res.json();
      setData(result);
    };
    fetchPriceConfig();
  }, []);

  //   Lọc ra thứ
  const days = [...new Set(data.map((item) => item.day_of_week))];
  // console.log("days", days);
  const addSlot = () => {
    setFormData((prev) => ({
      ...prev,
      slots: [...prev.slots, { start_time: "", end_time: "", price: "" }],
    }));
  };

  const handleSubmit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const res = await fetch(
      `${envConfig.NEXT_PUBLIC_APP_URL}/price-config/create`,
      {
        method: "POST",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );
    if (!res.ok) {
      throw new Error("llooix");
    }
    toast.success("Thêm cấu hình sân thành công!");
  };
  console.log("se", selectedPiceConfig);

  const handleSubmitEdit = async (e: React.ChangeEvent) => {
    e.preventDefault();
    const res = await fetch(
      `${envConfig.NEXT_PUBLIC_APP_URL}/price-config/update`,
      {
        method: "PATCH",
        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPiceConfig),
      },
    );
    if (!res.ok) {
      throw new Error("llooix");
    }
    setIsEditModalOpen(false);
    toast.success("Cập nhật cấu hình sân thành công!");
  };

  const handleRemove = async (id: number) => {
    const res = await fetch(
      `${envConfig.NEXT_PUBLIC_APP_URL}/price-config/delete/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      throw new Error("Lỗi");
    }
    toast.success("Xóa cấu hình sân thành công!");
  };
  return (
    <div>
      {" "}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Cấu hình giá sân
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý giá theo thứ và khung giờ
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="lg"
          className="gap-2"
        >
          <Plus size={20} />
          Thêm cấu hình
        </Button>
      </div>
      <div>
        {days.map((day) => {
          return (
            <div key={day}>
              <div className="flex items-center gap-2 px-4 py-3 bg-green-500">
                <Calendar />
                <span className="text-sm font-semibold text-white">
                  {DAY_MAP[day]}
                </span>
              </div>
              {data
                .filter((item) => item.day_of_week === day)
                .map((item) => (
                  <div key={item.id} className="divide-y divide-gray-100">
                    <div className="flex justify-between gap-3 px-4 py-3 item3-center">
                      <div className="flex items-center gap-2 text-sm w-36">
                        <Clock />
                        <span>{item?.start_time}</span>
                        <span>{item?.end_time}</span>
                      </div>
                      <div className="flex items-center flex-1 gap-1 text-sm font-semibold text-green-600">
                        <span className="text-green-500">$</span>
                        <span>
                          {new Intl.NumberFormat("vn-VN", {
                            style: "currency",
                            currency: "vnd",
                          }).format(item?.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <button
                          onClick={() => {
                            setSelectedPriceConfig(item);
                            setIsEditModalOpen(true);
                          }}
                          className="transition-colors hover:text-red-500"
                        >
                          <SquareArrowOutDownRight />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 transition"
                            >
                              <Trash size={16} />
                              Xóa
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn chắc chắn muốn xóa?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() => handleRemove(item.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
      {/* MODAL Thêm*/}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm cấu hình giá</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* DAY */}
            <div>
              <div>
                <label
                  htmlFor="day_of_week"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Thứ *
                </label>
                <input
                  type="number"
                  value={formData.day_of_week}
                  id="day_of_week"
                  onChange={(e) =>
                    setFormData({ ...formData, day_of_week: e.target.value })
                  }
                  max={8}
                  min={0}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Nhập thứ trong tuần"
                />
              </div>
            </div>

            {/* SLOTS */}
            {formData.slots.map((slot, index) => (
              <div
                key={index}
                className="overflow-hidden border border-gray-200 rounded-md "
              >
                {/* Header slot */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50  border-b border-gray-200 ">
                  <span className="uppercase ">Khung giờ {index + 1}</span>
                  {formData.slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newSlots = formData.slots.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, slots: newSlots });
                      }}
                      className="flex items-center gap-1 text-red-500 transition-colors hover:text-red-600"
                    >
                      <Trash2 />
                      Xóa
                    </button>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-3 gap-3 p-4">
                  <div>
                    <label className="block mb-1.5  ">Bắt đầu</label>
                    <input
                      type="time"
                      value={slot.start_time}
                      required
                      onChange={(e) => {
                        const newSlots = [...formData.slots];
                        newSlots[index].start_time = e.target.value;
                        setFormData({ ...formData, slots: newSlots });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none "
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5  ">Kết thúc</label>
                    <input
                      type="time"
                      value={slot.end_time}
                      required
                      onChange={(e) => {
                        const newSlots = [...formData.slots];
                        newSlots[index].end_time = e.target.value;
                        setFormData({ ...formData, slots: newSlots });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 ">
                      Giá sân <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={slot.price}
                      required
                      placeholder="100.000đ"
                      onChange={(e) => {
                        const newSlots = [...formData.slots];
                        newSlots[index].price = e.target.value;
                        setFormData({ ...formData, slots: newSlots });
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200 ">
              <Button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                variant="secondary"
              >
                Hủy
              </Button>

              <Button type="button" onClick={addSlot} variant="secondary">
                Thêm
              </Button>
              <Button type="submit" variant="default">
                Thay đổi
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* MODAL Sửa */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa cấu hình giá</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-5">
            {/* DAY */}
            <div>
              <div>
                <label
                  htmlFor="day_of_week"
                  className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Thứ *
                </label>
                <input
                  type="number"
                  value={selectedPiceConfig?.day_of_week}
                  id="day_of_week"
                  onChange={(e) =>
                    setSelectedPriceConfig((prev) =>
                      prev
                        ? {
                            ...prev,
                            day_of_week: Number(e.target.value),
                          }
                        : null,
                    )
                  }
                  max={8}
                  min={0}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Nhập thứ trong tuần"
                />
              </div>
            </div>

            {/* SLOTS */}
            {formData.slots.map((slot, index) => (
              <div
                key={index}
                className="overflow-hidden border border-gray-200 rounded-md "
              >
                {/* Header slot */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50  border-b border-gray-200 ">
                  <span className="uppercase ">Khung giờ {index + 1}</span>
                  {formData.slots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newSlots = formData.slots.filter(
                          (_, i) => i !== index,
                        );
                        setFormData({ ...formData, slots: newSlots });
                      }}
                      className="flex items-center gap-1 text-red-500 transition-colors hover:text-red-600"
                    >
                      <Trash2 />
                      Xóa
                    </button>
                  )}
                </div>

                {/* Fields */}
                <div className="grid grid-cols-3 gap-3 p-4">
                  <div>
                    <label className="block mb-1.5  ">Bắt đầu</label>
                    <input
                      type="time"
                      required
                      id="start_time"
                      value={selectedPiceConfig?.start_time}
                      onChange={(e) =>
                        setSelectedPriceConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                start_time: e.target.value,
                              }
                            : null,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none "
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5  ">Kết thúc</label>
                    <input
                      type="time"
                      id="end_time"
                      value={selectedPiceConfig?.end_time}
                      required
                      onChange={(e) =>
                        setSelectedPriceConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                end_time: e.target.value,
                              }
                            : null,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block mb-1.5 ">
                      Giá sân <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={selectedPiceConfig?.price}
                      required
                      onChange={(e) =>
                        setSelectedPriceConfig((prev) =>
                          prev
                            ? {
                                ...prev,
                                price: Number(e.target.value),
                              }
                            : null,
                        )
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200 ">
              <Button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                variant="secondary"
              >
                Hủy
              </Button>

              <Button type="submit" variant="default">
                Xác nhận
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

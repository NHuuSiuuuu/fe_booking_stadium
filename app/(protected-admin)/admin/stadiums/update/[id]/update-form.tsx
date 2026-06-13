"use client";

import envConfig from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SquarePen, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
type District = {
  ogc_fid: number;
  name_2: string;
};

type Stadium = {
  id: number;
  name: string;
  slug: string;
  address: string;
  description: string;
  type: number;
  thumbnail: string[];
  utility: string[];
  featured: boolean;
  status: boolean;
};

const UpdateStadiumBody = z.object({
  name: z.string(),
  address: z.string(),
  lng: z.string(),
  lat: z.string(),
  type: z.any(),
  description: z.string(),
  featured: z.enum(["0", "1"]),
  status: z.enum(["0", "1"]),
  district_id: z.string(),
});
type Props = {
  initialStadium: Stadium;
};

type UpdateStadiumType = z.TypeOf<typeof UpdateStadiumBody>;
export default function UpdateForm({ initialStadium }: Props) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [utilityInput, setUtilityInput] = useState("");
  const [utility, setUtility] = useState<string[]>(
    initialStadium.utility || [],
  );
  const [thumbnail, setThumbnail] = useState<File[]>([]);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateStadiumType>({
    resolver: zodResolver(UpdateStadiumBody),
    defaultValues: {
      name: initialStadium.name || "",
      address: initialStadium.address || "",
      lng: "",
      lat: "",
      type: initialStadium.type,
      description: initialStadium.description || "",
      featured: initialStadium.featured ? "1" : "0",
      status: initialStadium.status ? "1" : "0",
      district_id: "",
    },
  });

  useEffect(() => {
    fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/districts`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.districts ?? []))
      .catch(console.error);
  }, []);

  /* =======================
    Hàm xử lý file
  =======================*/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); // FileList chuyển sang  Array
    setThumbnail(files);
  };

  const addUtility = () => {
    if (!utilityInput.trim()) return;

    setUtility([...utility, utilityInput.trim()]);

    setUtilityInput("");
  };

  const removeUtility = (i: number) => {
    setUtility([...utility.filter((_, idx) => idx !== i)]);
  };
  /* =======================
    Hàm xử lý xỏa ảnh preview
  =======================*/
  const handleRemoveThumb = (index: number) => {
    console.log("click");
    setThumbnail([...thumbnail.filter((_, idx) => idx !== index)]);
  };

  /* =======================
    Hàm xử lý submit form
  =======================*/
  const onSubmit = async (data: UpdateStadiumType) => {
    setIsPending(true);

    try {
      if (thumbnail.length > 10) {
        throw new Error("Tối đa 10 ảnh");
      }
      // Tạo 1 form data để gửi text và file lên backend (OBJ đặc biệt của js)
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("lng", data.lng);
      formData.append("lat", data.lat);
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("featured", data.featured);
      formData.append("status", data.status);
      formData.append("district_id", data.district_id);
      formData.append("utility", JSON.stringify(utility));
      // Nhiều ảnh thì phải lặp qua - thằng này dạng arr chỉ có phần tử thôi
      thumbnail.forEach((file) => {
        formData.append("thumbnail", file);
      });

      const res = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadium/update/${initialStadium.id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        },
      );

      if (!res.ok) {
        console.log(res);
        throw new Error("Lỗi tạo sản phẩm");
      }
      reset();
      setUtility([]);
      setThumbnail([]);
      setUtilityInput("");
      toast.success("Sửa sản phẩm thành công");
      router.push("/admin/stadiums");
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full p-6 mx-auto wg-gray-1060">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Cập nhật Sân</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-4 bg-white rounded-lg shadow"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tên Sân <span className="text-red-500">*</span>
              </label>
              <input
                type="name"
                {...register("name")}
                required
                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                type="address"
                {...register("address")}
                required
                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.address && (
                <span className="text-red-500">{errors.address.message}</span>
              )}
            </div>

            {/* Quận */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Quận
              </label>
              <select
                {...register("district_id")}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition bg-white ${
                  errors.district_id
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">- - -</option>
                {districts?.map((item) => (
                  <option key={item.ogc_fid} value={item.ogc_fid}>
                    {item.name_2}
                  </option>
                ))}
              </select>
            </div>

            {/* Tọa độ */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  lng
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      {...register("lng")}
                      step="any"
                      placeholder="-180 đến 180"
                      className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.lng && (
                    <span className="text-red-500">{errors.lng.message}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  lat
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      {...register("lat")}
                      step="any"
                      placeholder="-90 đến 90"
                      className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.lng && (
                    <span className="text-red-500">{errors.lng.message}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                  type
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      {...register("type")}
                      className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Mô tả Sân
              </label>
              <textarea
                placeholder="Mô tả chi tiết về Sân..."
                {...register("description")}
                rows={4}
                className="w-full px-4 py-3 transition border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.description && (
                <span className="text-red-500">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* utility */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Tiện ích
              </label>

              <div className="flex gap-2">
                <input
                  value={utilityInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUtilityInput(e.target.value)
                  }
                  placeholder="Nhập tiện ích..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addUtility}
                  className="px-5 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  + Thêm
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {utility.map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100  rounded-full text-sm text-gray-700 "
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => removeUtility(index)}
                      className="text-gray-500 transition-colors hover:text-red-600"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Featured Status */}
            <div className="p-5 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Trạng thái nổi bật
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 transition bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                  <input
                    type="radio"
                    {...register("featured")}
                    value="1"
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-800">
                      Sân nổi bật
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      Hiển thị ở vị trí ưu tiên trên trang chủ
                    </p>
                  </div>
                </label>
                <label className="flex items-center p-3 transition bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                  <input
                    type="radio"
                    {...register("featured")}
                    value="0"
                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-800">
                      Sân thường
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      Hiển thị bình thường trong danh mục
                    </p>
                  </div>
                </label>
              </div>
            </div>
            {/* Product Status */}
            <div className="p-5 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Trạng thái Sân
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 transition bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                  <input
                    type="radio"
                    value="1"
                    {...register("status")}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-800">Hiển thị</span>
                    <p className="mt-1 text-sm text-gray-500">
                      Sân đang bán và hiển thị
                    </p>
                  </div>
                </label>
                <label className="flex items-center p-3 transition bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50">
                  <input
                    type="radio"
                    {...register("status")}
                    value="0"
                    className="w-5 h-5 text-red-600 focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <span className="font-medium text-gray-800">Ẩn</span>
                    <p className="mt-1 text-sm text-gray-500">
                      Sân ngừng bán hoặc ẩn
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div className="p-5 rounded-lg bg-gray-50">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Hình ảnh Sân
              </h3>
              <div className="space-y-4">
                <div className="p-6 text-center transition border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    multiple
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mb-3 bg-blue-100 rounded-full">
                      <Plus />
                    </div>
                    <span className="font-medium text-gray-700">
                      Tải ảnh lên
                    </span>
                    <p className="mt-1 text-sm text-gray-500">
                      Kéo thả hoặc chọn file
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </label>
                </div>

                {/* Image Preview */}
                {thumbnail.length > 0 && (
                  <div>
                    <h4 className="mb-3 font-medium text-gray-700">
                      Ảnh đã chọn ({thumbnail.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                      {thumbnail.map((thumb, index) => (
                        <div
                          key={index}
                          className="relative overflow-hidden border border-gray-200 rounded-lg group"
                        >
                          <img
                            className="object-cover w-full h-32"
                            src={URL.createObjectURL(thumb)}
                            alt={`preview-${index}`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveThumb(index)}
                            className="absolute flex items-center justify-center w-8 h-8 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100 hover:bg-red-600"
                          >
                            <X />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-xs text-white truncate">
                              {thumb.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {initialStadium.thumbnail &&
              initialStadium.thumbnail.length > 0 && (
                <div>
                  <h4 className="mb-3 font-medium text-gray-700">
                    Ảnh hiện tại ({initialStadium.thumbnail.length})
                  </h4>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                    {initialStadium.thumbnail.map((img, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden border border-gray-200 rounded-lg"
                      >
                        <img
                          className="object-cover w-full h-32"
                          src={img}
                          alt={`existing-${index}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex flex-col justify-end gap-4 pt-6 border-t border-gray-200 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setUtility(initialStadium.utility || []);
                  setThumbnail([]);
                  setUtilityInput("");
                }}
                className="px-6 py-3 font-medium text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Xóa form
              </button>
              <button type="submit" disabled={isPending}>
                {isPending ? (
                  <>Đang cập nhật sân...</>
                ) : (
                  <div className="relative inline-flex items-center justify-center h-12 px-6 overflow-hidden font-medium duration-500 rounded-md group bg-gradient-to-r from-blue-600 to-blue-800 text-neutral-200">
                    <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                      Cập nhật sân
                    </div>
                    <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                      <SquarePen />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import { MapPin } from "lucide-react";

export default function StadiumInfoCard({ data, stadium }) {
  return (
    <div className="bg-white border border-gray-200">
      <div className="px-5 py-3 bg-black">
        <p className="text-sm font-medium  text-white uppercase">
          Thông tin sân
        </p>
      </div>
      <div className="flex items-start gap-4 p-5">
        <img
          src={data?.stadiumBooking?.thumbnail}
          alt={stadium?.name}
          className="object-cover w-20 h-20 md:w-32 md:h-32 shrink-0 "
        />
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <p className="text-base font-medium tracking-tight text-black uppercase">
              {stadium?.name}
            </p>
            <span className="text-[10px] font-medium uppercase  bg-black text-white px-2 py-0.5">
              Sân {stadium?.type}
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-gray-500 uppercase tracking-wider">
            <MapPin size={11} />
            {stadium?.address}
          </p>
        </div>
      </div>
    </div>
  );
}

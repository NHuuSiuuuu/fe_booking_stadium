"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type ImageGalleryProps = {
  thumbnails: string[];
  type: number;
};

export default function ImageGallery({ thumbnails, type }: ImageGalleryProps) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="space-y-1">
      <div className="relative h-[300px] sm:h-[420px] overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src={thumbnails?.[activeImg]}
          alt=""
        />

        <div className="absolute top-4 right-4 bg-black text-white text-[12px] font-black uppercase  px-3 py-1.5">
          Sân {type}v{type}
        </div>
        <button
          onClick={() =>
            setActiveImg(
              (p) =>
                (p - 1 + (thumbnails.length ?? 0)) % (thumbnails.length ?? 1),
            )
          }
          className="absolute flex items-center justify-center w-8 h-8 text-white -translate-y-1/2 rounded-full left-3 top-1/2 bg-black/50 hover:bg-black/70"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={() =>
            setActiveImg((p) => (p + 1) % (thumbnails.length ?? 0))
          }
          className="absolute flex items-center justify-center w-8 h-8 text-white -translate-y-1/2 rounded-full right-3 top-1/2 bg-black/50 hover:bg-black/70"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      {/* Preview thumbnails */}
      <div className="grid grid-cols-4 gap-1">
        {thumbnails?.map((item, index) => (
          <button
            key={index}
            className={`h-[80px] overflow-hidden border-2 transition-all duration-300`}
          >
            <img
              src={item}
              alt=""
              onClick={() => setActiveImg(index)}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { MapPin, Heart, Inbox } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
type Stadium = {
  id: number;
  slug: string;
  name: string;
  address: string;
  type: string;
  price: number;
  thumbnail: string[];
};
export default function FavoritePage() {
  const [favorites, setFavorites] = useState<Stadium[]>([]);
  useEffect(() => {
    const data = localStorage.getItem("favorite");

    if (data) {
      setFavorites(JSON.parse(data));
    }
  }, []);

  //  bỏ yêu thích
  const removeFavorite = (id: number) => {
    const newList = favorites.filter((item) => item.id !== id);
    setFavorites(newList);
    localStorage.setItem("favorite", JSON.stringify(newList));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-5xl px-6 py-10 mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase">Sân yêu thích</h1>
            <p className="text-xs text-[#1b1b1b] uppercase">
              {favorites.length} sân
            </p>
          </div>
        </div>

        {/* Empty */}
        {favorites.length === 0 && (
          <div className="flex flex-col items-center py-20 bg-white">
            <Inbox size={40} className="text-gray-300" />
            <p className="text-[#1b1b1b]">Chưa có sân yêu thích</p>
            <Link href="/" className="px-4 py-2 mt-4 text-white bg-black">
              Khám phá →
            </Link>
          </div>
        )}

        {/* List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:mt-5 lg:grid-cols-3">
          {favorites.map((s) => (
            <div key={s.id} className="bg-white border">
              <div className="relative">
                <img
                  src={s.thumbnail?.[0]}
                  className="object-cover w-full h-40"
                />

                <button
                  onClick={() => removeFavorite(s.id)}
                  className="absolute top-2 left-2"
                >
                  <Heart className="text-red-500 animate-pulse duration-0 fill-red-500" />
                </button>
              </div>

              <div className="p-3">
                <p className="font-bold">{s.name}</p>
                <p className="flex gap-1 text-sm text-gray-500">
                  <MapPin size={12} /> {s.address}
                </p>

                <div className="flex justify-between mt-3">
                  <Link href={`/stadium/${s.slug}`}>
                    <button
                      className="text-white  bg-gray-900 hover:bg-gray-700  px-4
                 py-2  text-[11px] font-semibold  uppercase tracking-wider transition-colors"
                    >
                      Xem Ngay
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

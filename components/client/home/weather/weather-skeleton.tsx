export default function WeatherSkeleton() {
  return (
    <div className="bg-[#1b2c45] px-4 md:px-13 py-1 md:py-4">
      <div className="flex max-w-[1200px] mx-auto items-center justify-between gap-2">
        {/* LEFT */}
        <div className="flex items-center gap-3 flex-1">
          <div className="relative overflow-hidden rounded-full w-10 h-10 bg-white/10">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>

          <div>
            <div className="relative overflow-hidden rounded h-3 w-20 mb-2 bg-white/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>

            <div className="relative overflow-hidden rounded h-8 w-16 bg-white/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="flex-1 text-center">
          <div className="relative overflow-hidden rounded h-3 w-24 mx-auto mb-2 bg-white/10">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>

          <div className="relative overflow-hidden rounded h-7 w-32 mx-auto bg-white/10">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-end gap-2 flex-1">
          <div className="relative overflow-hidden rounded-full w-5 h-5 bg-white/10">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>

          <div>
            <div className="relative overflow-hidden rounded h-3 w-14 mb-2 bg-white/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>

            <div className="relative overflow-hidden rounded h-5 w-12 bg-white/10">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

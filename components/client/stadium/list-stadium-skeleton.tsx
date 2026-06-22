export default function ListStadiumSkeleton({ count }: any) {
  return (
    <div className="min-h-screen ">
      <div className="max-w-[1200px] mx-auto px-4 py-8 sm:px-6 ">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="overflow-hidden  border rounded  ">
              <div className="h-[180px] relative overflow-hidden bg-[#F0F0F4]">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>

              <div className="px-4 pt-4 pb-3.5 space-y-3">
                <div className="h-4 w-3/4 relative overflow-hidden  rounded bg-[#F0F0F4]">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </div>

                <div className="h-3 w-full relative overflow-hidden  rounded bg-[#F0F0F4]">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </div>

                <div className="h-px bg-slate-100 my-2.5" />

                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-2.5 w-16 relative overflow-hidden  rounded bg-[#F0F0F4]">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    </div>

                    <div className="h-4 w-24  relative overflow-hidden rounded bg-[#F0F0F4]">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                    </div>
                  </div>
                  <div className="h-9 w-24  relative overflow-hidden rounded bg-[#F0F0F4]">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

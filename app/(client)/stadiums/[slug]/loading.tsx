export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen bg-slate-50"
    >
      <div className="border-b border-gray-100">
        <div className="max-w-6xl px-4 py-3 mx-auto sm:px-6">
          <div className="h-4 w-56 overflow-hidden rounded bg-slate-200">
            <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div className="relative h-[260px] overflow-hidden rounded bg-slate-200 md:h-[420px]">
              <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            </div>

            <div className="space-y-4">
              <div className="h-7 w-2/3 overflow-hidden rounded bg-slate-200">
                <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>
              <div className="h-4 w-1/2 overflow-hidden rounded bg-slate-200">
                <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>
              <div className="h-16 w-full overflow-hidden rounded bg-slate-200">
                <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-4 w-24 overflow-hidden rounded bg-slate-200">
                <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="h-14 overflow-hidden rounded bg-slate-200"
                  >
                    <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-[360px]">
            <div className="sticky top-24 space-y-4 border border-slate-200 bg-white p-5">
              <div className="h-5 w-40 overflow-hidden rounded bg-slate-200">
                <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
              </div>
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="h-11 overflow-hidden rounded bg-slate-200"
                >
                  <div className="h-full w-full -translate-x-full motion-safe:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                </div>
              ))}
              <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500">
                Đang tải sân...
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

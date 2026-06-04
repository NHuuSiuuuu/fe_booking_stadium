export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-gray-200 border-t-black" />
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Đang tải sân...</p>
      </div>
    </div>
  );
}

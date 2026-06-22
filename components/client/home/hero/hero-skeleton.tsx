export default function HeroSkeleton() {
  return (
    <div className="relative min-h-[500px] md:min-h-[700px] bg-slate-900 animate-pulse flex flex-col justify-end">
      <div className="max-w-[1200px] mx-auto w-full px-3 md:px-8 pt-20 pb-14 space-y-4">
        {/* Badge */}
        <div className="h-4 w-48 bg-slate-700 rounded" />
        {/* Heading */}
        <div className="h-16 w-80 bg-slate-700 rounded" />
        <div className="h-16 w-64 bg-slate-700 rounded" />
        <div className="h-16 w-48 bg-slate-700 rounded" />
        {/* Subtitle */}
        <div className="h-4 w-96 bg-slate-700 rounded" />
        {/* Search bar */}
        <div className="h-16 w-full bg-slate-700 rounded mt-8" />
      </div>
    </div>
  );
}
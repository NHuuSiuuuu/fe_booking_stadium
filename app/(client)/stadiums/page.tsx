import {
  ListStadiums,
  StadiumFilters,
  StadiumFiltersSkeleton,
} from "@/app/(client)/stadiums/list-stadiums";
import ListStadiumSkeleton from "@/components/client/stadium/list-stadium-skeleton";
import envConfig from "@/config";
import { Suspense } from "react";


export default function page({ searchParams }: any) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1200px] mx-auto px-4 pt-3 md:py-8 sm:px-6">
        <Suspense fallback={<StadiumFiltersSkeleton />}>
          <StadiumFilters />
        </Suspense>

      <div className="px-4">
          <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
            Khám Phá 
          </p>
          <p className="text-[20px] font-bold mb-[2px] text-[#0f172a]">Sân Mới</p>
          <p className="text-[13px] font-bold uppercase text-[#94a3b8] mb-[4px]">
            Những sân vừa được cập nhật gần đây
          </p>
      </div>
        <Suspense fallback={<ListStadiumSkeleton count={6} />}>
          <ListStadiumsServer searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function ListStadiumsServer({ searchParams }: any) {
  const resoledParams = await searchParams;
  const page = resoledParams.page || 1;
  const keyword = resoledParams.keyword || "";
  const sort = resoledParams.sort;
  const filterStatus = resoledParams.filter;
  const filterFeatured = resoledParams.featured;
  const dist = resoledParams.filter;

  let url = `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/stadiums?page=${page}&limit=1`;
  if (keyword) {
    url += `&keyword=${keyword}`;
  }

  if (sort) {
    url += `&sort=${sort}`;
  }
  if (dist) {
    url += `&filter=${dist}`;
  }
  if (filterStatus) {
    console.log("filter status server", filterStatus);
    url += `&filter=${filterStatus}`;
  }
  if (filterFeatured) {
    console.log("filter filterFeatured server", filterStatus);
    url += `&filter=featured:${filterFeatured}`;
  }

  const res = await fetch(url, {
    next: {
      revalidate: 300,
    },
  });

  if (!res.ok) {
    throw new Error("Lỗi fetch sân");
  }

  const data = await res.json();

  return<> <ListStadiums initialData={data} currentPage={Number(page)} /></>;
}

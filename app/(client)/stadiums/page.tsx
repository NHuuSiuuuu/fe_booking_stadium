import ListStadiums from "@/app/(client)/stadiums/list-stadiums";
import envConfig from "@/config";

type Props = {
  searchParams: Promise<{
    page?: string;
    keyword?: string;
    sort?: string;
    filter?: string;
    featured?: string;
  }>;
};

export default async function page({ searchParams }: Props) {
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
      revalidate: 60,
    },
  });

  if (!res.ok) {
    throw new Error("Lỗi fetch sân");
  }

  const data = await res.json();
  return <ListStadiums initialData={data} />;
}

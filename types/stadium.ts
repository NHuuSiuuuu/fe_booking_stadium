export type District = {
  ogc_fid: number;
  name_2: string;
};

export type Stadium = {
  id: number;
  slug: string;
  name: string;
  address: string;
  type: string | number;
  price?: number;
  min_price?: number;
  max_price?: number;
  thumbnail: string[];
  start_time?: string;
  end_time?: string;
  featured?: boolean;
  status?: boolean;
  description?: string;
  district_id?: number | string;
  lat?: number;
  lng?: number;
  distance?: number;
};

export type StadiumsResponse = {
  stadiums: Stadium[];
  pageCurrent: number;
  totalPage: number;
  total: number;
};

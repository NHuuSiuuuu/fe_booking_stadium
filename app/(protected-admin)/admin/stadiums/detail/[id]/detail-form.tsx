"use client";
type Stadium = {
  id: number;
  name: string;
  slug: string;
  address: string;
  description: string;
  type: number;
  thumbnail: string[];
  utility: string[];
  featured: boolean;
  status: boolean;
};

type Props = {
  initialStadium: Stadium;
};
export default function DetailForm({ initialStadium }: Props) {
  console.log("initialStadium", initialStadium);
  return <div>detail-form</div>;
}

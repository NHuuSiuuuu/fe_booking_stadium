"use client";
import { useState } from "react";
import Hero from "@/components/client/layout/hero";

type District = { ogc_fid: number; name_2: string };

export default function HeroClient({ districts }: { districts: District[] }) {
  const [distCode, setDistCode] = useState("");
  const [type, setType] = useState("");

  return (
    <Hero
      districts={districts}
      distCode={distCode}
      setDistCode={setDistCode}
      type={type}
      setType={setType}
    />
  );
}

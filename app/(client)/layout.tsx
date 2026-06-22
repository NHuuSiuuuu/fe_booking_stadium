import { Suspense } from "react";
import Header from "@/components/client/layout/header/header";
import Footer from "@/components/client/layout/footer";
import { HeaderServer } from "@/components/client/layout/header/header-server";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<Header initialUser={null} />}>
        <HeaderServer />
      </Suspense>
      {children}

      <Footer />
    </>
  );
}

import Footer from "@/components/client/layout/footer";
import { HeaderServer } from "@/components/client/layout/header/header-server";
import Chat from "@/components/client/chat/chatbot";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderServer />
      <Chat />
      {children}

      <Footer />
    </>
  );
}

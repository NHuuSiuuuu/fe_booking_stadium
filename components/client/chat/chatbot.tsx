"use client";

import { ChevronDown, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `
# 👋 Xin chào!
Tôi là **trợ lý AI** của hệ thống đặt sân bóng **NHuuSiuuu**.

Tôi có thể hỗ trợ bạn:

- ⚽ Tìm sân theo khu vực
- 💰 Tra cứu giá thuê
- 🕒 Kiểm tra khung giờ còn trống
- 🚗 Xem tiện ích của sân
- 📍 Xem địa chỉ và thông tin chi tiết

**Ví dụ bạn có thể hỏi:**

- "Sân bóng Cầu Giấy có không?"
- "Giá sân Mỹ Đình bao nhiêu?"
`,
    },
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (!chatContainer) return;
    const handleScroll = () => {
      /**
       * Công thức:
       * Khoảng cách tới đáy = tổng chiều cao - px đã scroll xuống - chièu cao khung
       *  distanceToBottom = scrollHeight - scrollTop - clientHeight;
       */
      const threshold = 4550;

      // true: ở cuối chat - false: kéo lên đọc tin nhắn cũ
      const isBottom =
        chatContainer.scrollHeight -
          chatContainer.scrollTop -
          chatContainer.clientHeight <
        threshold;

      setIsAtBottom(isBottom);
    };
    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Nếu đang ở cuối chat
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const handleChatBot = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = { from: "user", text: inputMessage };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    const history = messages.map((msg) => ({
      role: msg.from === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    setIsPending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: inputMessage,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error("Không thể kết nối tới server");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: data.answer,
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
        },
      ]);
    } finally {
      setIsPending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[999999999] group cursor-pointer transition-all duration-300 ${
          isOpen
            ? "opacity-0 pointer-events-none scale-0"
            : "opacity-100 scale-100"
        } bg-[#042b47] text-white p-4 rounded-full shadow-2xl  transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300`}
      >
        {/* Ping */}
        <span className="absolute inset-0 rounded-full bg-[#042b47] animate-ping opacity-30"></span>
        {/* Icon */}
        <MessageCircle size={24} className="relative z-10 drop-shadow-sm" />
        {/* Chấm online */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-dot"></span>

        {/* Tooltip */}
        <div className="absolute right-0 mb-3 transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-none bottom-full group-hover:opacity-100 group-hover:translate-y-0">
          <div className="relative px-4 py-2 text-sm text-white bg-gray-900 shadow-xl rounded-xl whitespace-nowrap">
            <span className="font-medium">Cần hỗ trợ? Chat ngay!</span>
            <div className="absolute w-0 h-0 border-l-4 border-r-4 border-transparent top-full right-6 border-t-6 border-t-gray-900"></div>
          </div>
        </div>
      </button>

      <div
        className={`fixed bottom-4 right-4 w-[calc(100vw-3rem)] max-md:h-[50vh] h-[70vh] max-w-[280px] sm:w-80 sm:h-[420px] sm:max-w-none transition-all duration-300  rounded-[12px] shadow-2xl flex flex-col overflow-hidden z-50  
            ${
              isOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-0 pointer-events-none"
            } `}
      >
        <div
          className={`bg-[#042b47] text-white py-[15px] px-[20px] border-b-[1px]  flex justify-between items-center `}
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center rounded-full w-7 h-7 bg-white/20">
              <MessageCircle size={16} />
            </div>
            <p className={`text-sm font-semibold text-white`}>
              Hỗ trợ khác hàng
            </p>
          </div>
          <button
            className={`bg-none border-none text-white cursor-pointer text-[20px] p-[5px] flex items-center justify-center transition-transform duration-300 ease-in-out
            hover:scale-[1.1]`}
            onClick={() => setIsOpen(false)}
            aria-label="Đóng chat"
          >
            <X className="text-[16px]" size={16} />
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className={`flex flex-1 p-[20px] overflow-y-auto item- flex-col gap-[10px] bg-[#f5f5f5]`}
        >
          {messages?.map((item, index) => (
            <div
              key={index}
              className={`max-w-[80%] py-[10px] px-[15px] rounded-[15px]  mx-[5px] wrap-break-word 
                   ${item.from === "bot" ? "self-start bg-white text-[#333]  rounded-bl-[3px] shadow-xl" : "self-end bg-[#042b47] text-white  rounded-br-[5px] shadow-2xl"}                  `}
            >
              <div className={`text-sm `}>
                <section>
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <Link
                          href={href ?? "#"}
                          className="text-blue-600 underline"
                        >
                          {children}
                        </Link>
                      ),
                    }}
                  >
                    {item.text}
                  </ReactMarkdown>
                </section>
              </div>
            </div>
          ))}
          {!isAtBottom && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-[80px] right-[20px] bg-[#042b47] text-white p-2 rounded-full shadow-lg hover:scale-105 transition-all"
            >
              <ChevronDown size={16} />
            </button>
          )}
          <div ref={messagesEndRef} />

          {/* Dang loading */}
          {isPending && (
            <div className="flex justify-start message-slide">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-gray-600 bg-gray-200 rounded-full">
                  <MessageCircle size={16} />
                </div>
                <div className="px-4 py-3 bg-white border border-gray-200 rounded-bl-sm shadow-sm rounded-2xl">
                  <div className="loader"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form điền */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleChatBot();
          }}
          className={`flex p-[15px] bg-white gap-[10px]`}
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập tin nhắn của bạn..."
            className={`flex-1 py-[10px] px-[15px] border-solid border-[1px] border-[#e0e0e0] rounded-[20px] outline-none text-sm 
                focus:border-[#042b47] disabled:bg-[#f5f5f5] disabled:cursor-not-allowed`}
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isPending}
            className={`bg-[#042b47] text-white border-none rounded-[20px] py-[10px] px-[20px] cursor-pointer font-medium transition-all duration-300 ease-in-out
             disabled:active:scale-[0.98] disabled:bg-[#ccc] disabled:cursor-not-allowed`}
          >
            Gửi
          </button>
        </form>
      </div>
    </>
  );
}

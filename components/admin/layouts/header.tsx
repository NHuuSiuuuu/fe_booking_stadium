"use client";

import { Menu, MessageSquareMore, Bell, User } from "lucide-react";

export default function Header({ collapsed, setCollapsed, user }: any) {
  return (
    <header className="bg-white border-b border-gray-200 flex items-center h-[52px] px-5 sticky top-0 z-10">
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 text-gray-500 hover:text-gray-800 transition-colors mr-2"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Right */}
      <div className="flex items-center gap-1 ml-auto">
        <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
          <MessageSquareMore className="w-5 h-5" />
          <span className="absolute top-1 right-1 bg-green-500 text-white text-[10px] font-medium min-w-[16px] h-4 rounded-full flex items-center justify-center px-[3px]">
            2
          </span>
        </button>

        <button className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-medium min-w-[16px] h-4 rounded-full flex items-center justify-center px-[3px]">
            2
          </span>
        </button>

        <button className="flex items-center gap-2 px-2 h-10 rounded-md hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-900">
            {user?.fullname || "Admin"}
          </span>
        </button>
      </div>
    </header>
  );
}

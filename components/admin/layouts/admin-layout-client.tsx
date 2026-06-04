"use client";

import Sidebar from "@/components/admin/layouts/sidebar";
import Header from "@/components/admin/layouts/header";
import { useState } from "react";

interface AdminLayoutClientProps {
  children: React.ReactNode;
  user?: any;
}


export function AdminLayoutClient({ children, user }: AdminLayoutClientProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="  bg-gray-100">
      <Header collapsed={collapsed} setCollapsed={setCollapsed} user={user} />
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1">  {children}</div>
      </div>
    </div>
  );
}

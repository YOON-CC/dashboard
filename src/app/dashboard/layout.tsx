"use client";

import { ReactNode } from "react";
import Drawer from "@/components/ui/Drawer";
import Header from "@/components/ui/Header";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-gradient-to-tr from-purple-400 via-blue-400 to-indigo-400">
      <Drawer />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

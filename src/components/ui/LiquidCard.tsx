"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function LiquidCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-3xl bg-white/20 backdrop-blur-xl shadow-2xl border border-white/30 p-8 transition hover:scale-[1.02] ${className}`}
    >
      {children}
    </div>
  );
}

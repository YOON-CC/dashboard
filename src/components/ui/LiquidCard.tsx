"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function LiquidCard({ children, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl bg-white/20 backdrop-blur-lg shadow-lg border border-white/30 p-6 ${className}`}
    >
      {children}
    </div>
  );
}

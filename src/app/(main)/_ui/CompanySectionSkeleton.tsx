import React from "react";

export default function CompanyCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 bg-slate-700/50 backdrop-blur-xl rounded-xl shadow-lg p-4 space-y-3 animate-pulse h-[220px]">
      <div className="flex items-center justify-between">
        <div className="h-6 w-6 bg-white/30 rounded"></div>
        <div className="h-4 w-12 bg-white/30 rounded"></div>
      </div>

      <div className="h-4 w-32 bg-white/30 rounded"></div>

      <div className="space-y-2">
        <div className="h-3 w-full bg-borderCustom rounded"></div>
      </div>

      <div className="space-y-1 h-24 flex flex-col justify-around">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 w-full bg-borderCustom rounded"></div>
        ))}
      </div>
    </div>
  );
}

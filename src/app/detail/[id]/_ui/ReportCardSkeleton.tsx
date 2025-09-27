import React from "react";

export default function SkeletonReportCard() {
  return (
    <div className="bg-black/40 p-3 rounded-md flex flex-col gap-2 animate-pulse">
      <div className="h-4 w-3/4 bg-borderCustom rounded"></div>
      <div className="h-3 w-1/2 bg-borderCustom rounded"></div>
    </div>
  );
}

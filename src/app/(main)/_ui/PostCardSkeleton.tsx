import React from "react";

export default function PostCardSkeleton() {
  return (
    <div className="flex flex-col justify-between p-3 rounded-xl h-40 bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl border border-borderCustom animate-pulse space-y-3">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-3 w-24 bg-borderCustom rounded"></div>
          <div className="h-2 w-16 bg-borderCustom rounded"></div>
        </div>
      </div>

      <div className="flex flex-col justify-end gap-2">
        <div className="h-3 w-full bg-borderCustom rounded"></div>
        <div className="h-3 w-5/6 bg-borderCustomrounded"></div>
      </div>
    </div>
  );
}

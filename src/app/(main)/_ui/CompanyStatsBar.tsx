import React from "react";
import { CompanyStatistics } from "../utils/statistics";

interface CompanyStatsBarProps {
  companyName: string;
  stats: CompanyStatistics;
}

export default function CompanyStatsBar({
  companyName,
  stats,
}: CompanyStatsBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white/90">
        회사명: {companyName}
      </span>
      <span className="px-2 py-1 bg-purple-500/20 backdrop-blur-md rounded-full text-xs text-white/90">
        이번 달: {stats.lastMonth} tCO2
      </span>
      <span className="px-2 py-1 bg-blue-500/20 backdrop-blur-md rounded-full text-xs text-white/90">
        저번 달: {stats.prevMonth} tCO2
      </span>
      <span className="px-2 py-1 bg-green-500/20 backdrop-blur-md rounded-full text-xs text-white/90">
        전체 대비: {((stats.total / stats.totalCompanyValue) * 100).toFixed(1)}%
      </span>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
          stats.isAboveAverage
            ? "bg-green-400/30 text-green-400"
            : "bg-red-400/30 text-red-400"
        }`}
      >
        {stats.isAboveAverage
          ? "다른 기업 평균보다 높음"
          : "다른 기업 평균보다 낮음"}
      </span>
    </div>
  );
}

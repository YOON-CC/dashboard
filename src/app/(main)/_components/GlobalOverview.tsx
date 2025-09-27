"use client";

import { Company } from "@/lib/types";
import { Users } from "lucide-react";
import { useMemo } from "react";

interface GlobalOverviewProps {
  companies: Company[];
}

const GlobalOverview = ({ companies }: GlobalOverviewProps) => {
  // 전체 배출량
  const totalEmissions = useMemo(() => {
    return companies.reduce(
      (sum, c) => sum + c.emissions.reduce((s, e) => s + e.emissions, 0),
      0
    );
  }, [companies]);

  // 예상 탄소세 (배출량 * 50)
  const estimatedTax = useMemo(() => totalEmissions * 50, [totalEmissions]);

  return (
    <div className="lg:col-span-2">
      {/* 섹션 타이틀 */}
      <div className="mb-3">
        <h2 className="text-xl font-bold text-white/90 mb-2">전체 현황</h2>
        <div className="w-20 h-1 bg-gradient-to-r from-white to-point"></div>
      </div>

      {/* 카드 */}
      <div className="bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl px-6 py-4 border border-borderCustom shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-borderCustom rounded-2xl p-3 backdrop-blur-sm">
              <Users className="w-8 h-8 text-white drop-shadow-sm" />
            </div>
            <div className="text-right">
              <span className="text-white/70 text-sm font-medium">
                Global Overview
              </span>
              <div className="w-2 h-2 bg-point rounded-full ml-auto mt-1 animate-pulse"></div>
            </div>
          </div>

          {/* 데이터 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 전체 배출량 */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">
                전체 배출량
              </h3>
              <p className="text-white/80 text-2xl font-semibold mb-1">
                {totalEmissions}{" "}
                <span className="text-lg font-normal">tCO2</span>
              </p>
            </div>

            {/* 예상 탄소세 */}
            <div className="border-l border-borderCustom pl-6">
              <p className="text-white/70 text-sm mb-1">예상 탄소세</p>
              <p className="text-white font-bold text-xl">
                ${estimatedTax.toLocaleString()}
              </p>
            </div>

            {/* 자회사 수 */}
            <div className="border-l border-borderCustom pl-6">
              <p className="text-white/70 text-sm mb-1">자회사 수</p>
              <p className="text-white font-bold text-xl">
                {companies.length}개 회사
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalOverview;

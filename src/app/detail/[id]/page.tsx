"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Company, fetchCompanies } from "@/lib/api";
import LineChartD3 from "../../dashboard/_components/BarChartD3";

export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id;
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies().then((data) => {
      const selected = data.find((c) => c.id === companyId) || null;
      setCompany(selected);
    });
  }, [companyId]);

  if (!company)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">데이터를 불러오는 중...</p>
        </div>
      </div>
    );

  const totalEmissions = company.emissions.reduce(
    (sum, e) => sum + e.emissions,
    0
  );
  const topMonth = company.emissions.reduce((prev, curr) =>
    prev.emissions > curr.emissions ? prev : curr
  );
  const avgEmissions = totalEmissions / company.emissions.length;
  const minMonth = company.emissions.reduce((prev, curr) =>
    prev.emissions < curr.emissions ? prev : curr
  );

  // 월별 트렌드 계산
  const recentTrend =
    company.emissions.slice(-3).reduce((sum, e) => sum + e.emissions, 0) / 3;
  const previousTrend =
    company.emissions.slice(-6, -3).reduce((sum, e) => sum + e.emissions, 0) /
    3;
  const trendDirection = recentTrend > previousTrend ? "증가" : "감소";
  const trendPercentage = Math.abs(
    ((recentTrend - previousTrend) / previousTrend) * 100
  ).toFixed(1);

  return (
    <div
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/dashboard-bg.jpg')",
      }}
    >
      <div className="flex-1 flex flex-col min-w-0 p-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl"></div>
          <div className="relative p-6 bg-black/30 backdrop-blur-md rounded-3xl border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {company.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {company.name}
                </h1>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm">
                    📍 {company.country}
                  </span>
                  <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/80 text-sm">
                    🏭 제조업
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 주요 지표 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 총 배출량 */}
            <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏭</span>
                </div>
                <span className="text-red-400 text-sm font-medium">TOTAL</span>
              </div>
              <h3 className="text-white/60 text-sm mb-2">총 배출량</h3>
              <p className="text-white text-3xl font-bold">
                {totalEmissions.toLocaleString()}
              </p>
              <p className="text-white/60 text-sm mt-1">tCO2</p>
            </div>

            {/* 평균 배출량 */}
            <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <span className="text-blue-400 text-sm font-medium">AVG</span>
              </div>
              <h3 className="text-white/60 text-sm mb-2">월평균 배출량</h3>
              <p className="text-white text-3xl font-bold">
                {avgEmissions.toLocaleString("ko-KR", {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-white/60 text-sm mt-1">tCO2/월</p>
            </div>

            {/* 최고 배출량 */}
            <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <span className="text-orange-400 text-sm font-medium">MAX</span>
              </div>
              <h3 className="text-white/60 text-sm mb-2">최대 배출량</h3>
              <p className="text-white text-3xl font-bold">
                {topMonth.emissions.toLocaleString()}
              </p>
              <p className="text-white/60 text-sm mt-1">{topMonth.yearMonth}</p>
            </div>

            {/* 트렌드 */}
            <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${
                    trendDirection === "증가"
                      ? "bg-yellow-500/30"
                      : "bg-green-500/30"
                  } rounded-xl flex items-center justify-center`}
                >
                  <span className="text-2xl">
                    {trendDirection === "증가" ? "⚠️" : "✅"}
                  </span>
                </div>
                <span
                  className={`${
                    trendDirection === "증가"
                      ? "text-yellow-400"
                      : "text-green-400"
                  } text-sm font-medium`}
                >
                  TREND
                </span>
              </div>
              <h3 className="text-white/60 text-sm mb-2">최근 트렌드</h3>
              <p className="text-white text-2xl font-bold">
                {trendDirection} {trendPercentage}%
              </p>
              <p className="text-white/60 text-sm mt-1">vs 이전 3개월</p>
            </div>
          </div>

          {/* 차트 섹션 */}
          <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  월별 배출량 추이
                </h2>
                <p className="text-white/60">지난 12개월간의 CO2 배출량 변화</p>
              </div>
            </div>
            {/* <div className="h-80">
              <LineChartD3 data={company.emissions} />
            </div> */}
          </div>

          {/* 상세 분석 섹션 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 배출량 분석 */}
            <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
                <h2 className="text-2xl font-bold text-white">배출량 분석</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <h3 className="text-emerald-400 font-semibold mb-2">
                    📊 통계 요약
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">최고 배출월</p>
                      <p className="text-white font-semibold">
                        {topMonth.yearMonth}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60">최저 배출월</p>
                      <p className="text-white font-semibold">
                        {minMonth.yearMonth}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl">
                  <h3 className="text-emerald-400 font-semibold mb-2">
                    🎯 성과 지표
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">변동성</span>
                      <span className="text-white">
                        {(
                          ((topMonth.emissions - minMonth.emissions) /
                            avgEmissions) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">안정성</span>
                      <span className="text-emerald-400">
                        {avgEmissions / topMonth.emissions > 0.8
                          ? "높음"
                          : "보통"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 예측 및 목표 */}
            <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-violet-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-white">탄소 관리</h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl">
                  <h3 className="text-violet-400 font-semibold mb-3">
                    💰 예상 탄소세
                  </h3>
                  <p className="text-white text-2xl font-bold">
                    ${(totalEmissions * 50).toLocaleString()}
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    연간 예상 탄소세 (탄소톤당 $50 기준)
                  </p>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl">
                  <h3 className="text-violet-400 font-semibold mb-3">
                    📉 감축 목표
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">2024년 목표</span>
                      <span className="text-yellow-400">-15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">2025년 목표</span>
                      <span className="text-orange-400">-30%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/60">2030년 목표</span>
                      <span className="text-green-400">-50%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 추가 정보 카드 */}
          <div className="bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-slate-500/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h2 className="text-2xl font-bold text-white">개선 제안</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="text-blue-400 text-sm font-semibold mb-2">
                  🔧 기술 개선
                </div>
                <p className="text-white/80 text-sm">
                  에너지 효율 장비 도입으로 20% 배출량 감소 가능
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="text-green-400 text-sm font-semibold mb-2">
                  🌱 신재생 에너지
                </div>
                <p className="text-white/80 text-sm">
                  태양광 설비 도입으로 연간 30% 탄소 중립 달성
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="text-purple-400 text-sm font-semibold mb-2">
                  📊 모니터링
                </div>
                <p className="text-white/80 text-sm">
                  실시간 배출량 모니터링으로 즉각적인 대응 체계 구축
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

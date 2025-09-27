"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchCompanies, fetchPosts } from "@/lib/api";
import SidePanel from "@/components/layout/SidePanel";
import Header from "@/components/layout/Header";
import * as d3 from "d3";
import PieChart from "./_components/PieChart";
import BarChartD3 from "@/components/d3/BarChartD3";
import HorizontalBarChart from "@/components/d3/HorizontalBarChart";
import CompanyStatsBar from "@/app/(main)/_ui/CompanyStatsBar";
import { calculateCompanyStatistics } from "@/app/(main)/utils/statistics";
import { Company, Post } from "@/lib/types";
import { exportReport } from "./_utils/exportUtils";
import SkeletonReportCard from "./_ui/ReportCardSkeleton";

export default function CompanyDetailPage() {
  // 라우팅 파라미터
  const params = useParams();
  const companyId = params.id;

  // 상태
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailDropdown, setShowDetailDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // 데이터 로딩
  useEffect(() => {
    fetchCompanies().then(setCompanies);
    fetchPosts().then(setPosts);
  }, []);

  useEffect(() => {
    if (posts !== null) {
      setIsLoading(false);
    }
  }, [posts]);

  // 선택된 company 설정
  useEffect(() => {
    fetchCompanies().then((data) => {
      setCompanies(data);
      const selected = data.find((c) => c.id === companyId);
      setCompany(selected || null);
    });
  }, [companyId]);

  // 데이터 가공
  const companyPosts = posts
    .filter((p) => p.resourceUid === company?.id)
    .sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1));

  const selectedReport =
    companyPosts.find((p) => p.id === selectedReportId) || null;

  // 유틸
  const handleExport = () => {
    if (!selectedReport) return;
    exportReport(selectedReport);
  };

  // 배경 유틸
  const [bg, setBg] = useState("");

  useEffect(() => {
    const storedBg = localStorage.getItem("dashboardBg");
    if (storedBg) setBg(storedBg);

    const handler = () => {
      const newBg = localStorage.getItem("dashboardBg");
      if (newBg) setBg(newBg);
    };
    window.addEventListener("dashboardBgChange", handler);

    return () => {
      window.removeEventListener("dashboardBgChange", handler);
    };
  }, []);

  return (
    <div
      className="flex min-h-screen overflow-hidden bg-cover bg-center p-3 sm:p-6 items-center justify-center"
      style={{
        backgroundImage: `url('/images/${bg}.jpg')`,
      }}
    >
      <div className="h-full w-full min-w-0 rounded-3xl backdrop-blur-[12px] bg-primaryBg border border-borderCustom shadow-2xl overflow-hidden p-2 sm:p-3">
        <SidePanel
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          showDetailDropdown={showDetailDropdown}
          setShowDetailDropdown={setShowDetailDropdown}
          companies={companies}
        />
        <Header
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          isDetailPage={company?.name}
        />

        <div className="min-h-[600px] lg:h-[820px] flex flex-col lg:flex-row">
          {/* 왼쪽: 회사 정보 */}
          <div className="flex-1 lg:flex-none lg:w-1/2 p-3 sm:p-6 rounded-xl flex flex-col gap-4 sm:gap-6 shadow-inner">
            {/* 회사 기본 정보 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-point flex items-center justify-center text-white text-lg sm:text-2xl font-bold">
                {company?.name[0]}
              </div>
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold">
                  {company?.name}
                </h2>
                <p className="text-white/80 text-sm sm:text-base">
                  Country: {company?.country}
                </p>
              </div>
            </div>

            {/* 핵심 배출 지표 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-black/50 rounded-lg p-2 sm:p-3 flex flex-col items-center border border-borderCustom">
                <h4 className="text-white/90 text-xs sm:text-sm font-semibold text-center">
                  총 배출량
                </h4>
                <p className="text-green-400 text-base sm:text-xl font-bold text-center">
                  {company?.emissions.reduce((sum, e) => sum + e.emissions, 0)}{" "}
                  <span className="text-xs sm:text-base">tCO₂</span>
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-2 sm:p-3 flex flex-col items-center border border-borderCustom">
                <h4 className="text-white/90 text-xs sm:text-sm font-semibold text-center">
                  평균 배출량
                </h4>
                <p className="text-blue-400 text-base sm:text-xl font-bold text-center">
                  {company &&
                    (
                      company.emissions.reduce(
                        (sum, e) => sum + e.emissions,
                        0
                      ) / company.emissions.length
                    ).toFixed(2)}{" "}
                  <span className="text-xs sm:text-base">tCO₂</span>
                </p>
              </div>

              {/* 추가 정보 */}
              <div className="bg-black/50 rounded-lg p-2 sm:p-3 flex flex-col items-center border border-borderCustom">
                <h4 className="text-white/90 text-xs sm:text-sm font-semibold text-center">
                  최근 배출월
                </h4>
                <p className="text-white text-sm sm:text-lg font-semibold text-center">
                  {company?.emissions.sort((a, b) =>
                    b.yearMonth.localeCompare(a.yearMonth)
                  )[0]?.yearMonth || "N/A"}
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-2 sm:p-3 flex flex-col items-center border border-borderCustom">
                <h4 className="text-white/90 text-xs sm:text-sm font-semibold text-center">
                  주요 배출원
                </h4>
                <p className="text-pink-400 text-sm sm:text-lg font-semibold text-center">
                  {company?.emissions.sort(
                    (a, b) => b.emissions - a.emissions
                  )[0]?.source || "N/A"}
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-2 sm:p-3 flex flex-col items-center border border-borderCustom">
                <h4 className="text-white/90 text-xs sm:text-sm font-semibold text-center">
                  배출원 수
                </h4>
                <p className="text-yellow-400 text-sm sm:text-lg font-semibold">
                  {new Set(company?.emissions.map((e) => e.source)).size}
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-2 sm:p-3 flex flex-col items-center border border-borderCustom">
                <h4 className="text-white/90 text-xs sm:text-sm font-semibold text-center">
                  리포트 수
                </h4>
                <p className="text-teal-400 text-sm sm:text-lg font-semibold">
                  {posts.filter((p) => p.resourceUid === company?.id).length}
                </p>
              </div>
            </div>

            {/* 최근 리포트 */}
            <div className="bg-black/40 p-3 rounded-lg flex flex-col gap-2 text-white/80 max-h-[300px] lg:max-h-[400px] overflow-auto border border-borderCustom">
              <h4 className="text-white font-semibold text-sm sm:text-base">
                최근 리포트
              </h4>

              {/* 로딩 중일 때 */}
              {isLoading &&
                Array.from({ length: 2 }).map((_, idx) => (
                  <SkeletonReportCard key={idx} />
                ))}

              {/* 로딩 끝나고 데이터 있을 때 */}
              {!isLoading &&
                companyPosts.length > 0 &&
                companyPosts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-black/30 p-2 rounded-md hover:bg-green-500/20 cursor-pointer transition"
                    onClick={() =>
                      setSelectedReportId((prev) =>
                        prev === p.id ? null : p.id
                      )
                    }
                  >
                    <p className="font-semibold text-sm sm:text-base">
                      {p.title}
                    </p>
                    <p className="text-xs text-white/60">{p.dateTime}</p>
                    {selectedReportId === p.id && (
                      <div className="bg-black/50 p-3 rounded-md text-white/80 text-xs sm:text-sm mt-2">
                        {p.content}
                      </div>
                    )}
                  </div>
                ))}

              {/* 로딩 끝나고 데이터 없을 때 */}
              {!isLoading && companyPosts.length === 0 && (
                <p className="text-white/50 text-xs sm:text-sm">
                  리포트가 없습니다.
                </p>
              )}
            </div>

            {/* 액션 버튼 */}
            <div className="mt-auto flex gap-2">
              <button
                className={`flex-1 py-2 sm:py-3 rounded-lg font-semibold text-white text-sm sm:text-base transition border border-borderCustom ${
                  selectedReport
                    ? "bg-green-500/70 hover:bg-green-400 cursor-pointer"
                    : "bg-black/20 cursor-not-allowed"
                }`}
                disabled={!selectedReport}
                onClick={handleExport}
              >
                Export Report
              </button>
            </div>
          </div>

          {/* 오른쪽 차트 영역 */}
          <div className="flex-1 lg:flex-none lg:w-1/2 grid grid-cols-1 lg:grid-cols-2 grid-rows-1 lg:grid-rows-2 gap-4 h-auto lg:h-full p-2 sm:p-4 rounded-xl">
            {/* 파이 차트 */}
            <div className="bg-black/30 flex flex-col rounded-2xl p-4 min-h-0 overflow-hidden border border-borderCustom">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-2 flex-shrink-0 text-center">
                배출 원천
              </h3>
              <div className="flex-1 min-h-0 w-full flex items-center justify-center">
                <PieChart
                  data={
                    company
                      ? Array.from(
                          d3.rollup(
                            company.emissions,
                            (v) => d3.sum(v, (d) => d.emissions),
                            (d) => d.source
                          ),
                          ([source, value]) => ({ source, value })
                        )
                      : []
                  }
                />
              </div>
            </div>

            {/* 바 차트 */}
            <div className="bg-black/30 flex flex-col items-center justify-center rounded-2xl p-4 min-h-[200px] lg:min-h-0 border border-borderCustom">
              <div className="w-full h-full">
                <BarChartD3
                  companies={companies}
                  selectedCompanyId={companyId}
                  isDetailPage={true}
                />
              </div>
            </div>

            {/* 가로 바 차트 - 전체 너비 차지 */}
            <div className="bg-black/30 flex flex-col items-center justify-center rounded-2xl lg:col-span-2 p-4 min-h-[250px] lg:min-h-0 border border-borderCustom">
              {companies
                .filter((c) => c.id === companyId)
                .map((c) => {
                  const stats = calculateCompanyStatistics(c, companies);

                  return (
                    <div key={c.id} className="w-full">
                      <div className="mb-4">
                        <HorizontalBarChart
                          lastMonth={stats.lastMonth}
                          prevMonth={stats.prevMonth}
                          sameCompanyAverage={stats.sameCompanyAverage}
                          otherAverage={stats.otherAverage}
                        />
                      </div>
                      <CompanyStatsBar companyName={c.name} stats={stats} />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

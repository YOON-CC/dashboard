"use client";

import React, { useEffect, useState } from "react";
import { Building2, TrendingUp } from "lucide-react";
import { fetchCompanies, fetchPosts } from "@/lib/api";
import BarChartD3 from "../components/d3/BarChartD3";
import { useRouter } from "next/navigation";
import HorizontalBarChart from "../components/d3/HorizontalBarChart";
import Header from "@/components/layout/Header";
import SidePanel from "@/components/layout/SidePanel";
import GlobalOverview from "./(main)/_components/GlobalOverview";
import HeadlineNews from "./(main)/_ui/HeadlineNews";
import CompanySection from "./(main)/_components/CompanySection";
import { calculateCompanyStatistics } from "./(main)/utils/statistics";
import CompanyStatsBar from "./(main)/_ui/CompanyStatsBar";
import { Company, Post } from "@/lib/types";

const Dashboard = () => {
  const router = useRouter();

  // 상태
  const [showDetailDropdown, setShowDetailDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  // 데이터 상태
  const [companies, setCompanies] = useState<Company[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // 데이터 로딩
  useEffect(() => {
    fetchCompanies()
      .then(setCompanies)
      .catch((err) => console.error("Failed to load companies:", err));

    fetchPosts()
      .then(setPosts)
      .catch((err) => console.error("Failed to load posts:", err));
  }, []);

  // 파싱 / 필터링 유틸
  const parseCompanyEmissions = (company: Company) => {
    const totalEmissions = company.emissions.reduce(
      (sum, e) => sum + e.emissions,
      0
    );

    const monthlyData = company.emissions.map((e) => ({
      month: e.yearMonth,
      value: e.emissions,
    }));

    return { totalEmissions, monthlyData };
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // 핸들러
  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId((prev) => (prev === companyId ? null : companyId));
  };

  const [bg, setBg] = useState("dashboard-bg1");

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
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center p-6 items-center justify-center"
      style={{
        backgroundImage: `url('/images/${bg}.webp')`,
      }}
    >
      {/* 메인 */}
      <div className="h-full w-full min-w-0 rounded-3xl backdrop-blur-[12px] bg-primaryBg border border-borderCustom shadow-2xl overflow-auto p-3">
        {/* 사이드패널 */}
        <SidePanel
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          showDetailDropdown={showDetailDropdown}
          setShowDetailDropdown={setShowDetailDropdown}
          companies={companies}
        />

        {/* 헤더 */}
        <Header isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

        {/* 대시보드 콘텐츠 */}
        <main className="flex-1 mt-3 flex flex-col backdrop-blur-[8px] bg-primaryBg border border-borderCustom rounded-3xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼족 contents*/}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 전체 배출량 카드  */}
                <GlobalOverview companies={companies} />

                {/* 자회사 그룹 섹션 */}
                <CompanySection
                  search={search}
                  setSearch={setSearch}
                  filteredCompanies={filteredCompanies}
                  selectedCompanyId={selectedCompanyId}
                  handleCompanyClick={handleCompanyClick}
                  parseCompanyEmissions={parseCompanyEmissions}
                  posts={posts}
                />
              </div>
            </div>

            {/* 오른쪽 contents*/}
            <div className="flex flex-col justify-between h-full">
              {/* 월별 배출량 */}
              <div className="bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-borderCustom shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-point" />
                  월별 배출량
                </h3>
                <div className="h-64">
                  <BarChartD3
                    companies={companies}
                    selectedCompanyId={selectedCompanyId}
                  />
                </div>
              </div>

              {/* 상세 정보 카드 */}
              {selectedCompanyId && (
                <div
                  className="h-[400px] group bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-borderCustom shadow-2xl relative overflow-hidden cursor-pointer hover:scale-101 hover:shadow-2xl transition-transform duration-300"
                  onClick={() => router.push(`/detail/${selectedCompanyId}`)}
                >
                  {/* 배경 장식 */}
                  <div className="absolute top-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl"></div>

                  {/* 제목과 화살표 */}
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-purple-300" />
                      상세 정보
                    </span>
                    <span className="text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      &rarr;
                    </span>
                  </h3>

                  {companies
                    .filter((c) => c.id === selectedCompanyId)
                    .map((c) => {
                      const stats = calculateCompanyStatistics(c, companies);

                      return (
                        <div key={c.id}>
                          <HorizontalBarChart
                            lastMonth={stats.lastMonth}
                            prevMonth={stats.prevMonth}
                            sameCompanyAverage={stats.sameCompanyAverage}
                            otherAverage={stats.otherAverage}
                          />
                          <CompanyStatsBar companyName={c.name} stats={stats} />
                        </div>
                      );
                    })}
                </div>
              )}
              {!selectedCompanyId && (
                <HeadlineNews selectedCompanyId={selectedCompanyId} />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 반응형 오버레이 */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;

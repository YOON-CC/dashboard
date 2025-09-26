"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Leaf,
  AlertTriangle,
  Building2,
  Menu,
  X,
  DollarSign,
  Target,
  Globe,
  TrendingUp,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Newspaper,
} from "lucide-react";
import {
  companies,
  Company,
  Country,
  fetchCompanies,
  fetchCountries,
  fetchPosts,
  Post,
} from "@/lib/api";
import LineChartD3 from "./dashboard/_components/BarChartD3";
import { useRouter } from "next/navigation";
import DonutChart from "./dashboard/_components/HorizontalBarChart";
import HorizontalBarChart from "./dashboard/_components/HorizontalBarChart";
import Header from "@/components/layout/Header";
import SidePanel from "@/components/layout/SidePanel";

const Dashboard = () => {
  const router = useRouter();
  const [showDetailDropdown, setShowDetailDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  const [companies, setCompanies] = useState<Company[]>([]);
  // const [countries, setCountries] = useState<Country[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetchCompanies().then(setCompanies);
    //   fetchCountries().then(setCountries);
    fetchPosts().then(setPosts);
  }, []);

  const parseCompanyEmissions = (company: (typeof companies)[0]) => {
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

  const [search, setSearch] = useState("");
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  // 자회사 클릭 핸들러
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId((prev) => (prev === companyId ? null : companyId));
  };

  const scrollLeftFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: "smooth" });
    }
  };

  const scrollRightFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: "smooth" });
    }
  };

  const mockNews = [
    { id: 1, title: "탄소중립 정책 강화, 기업 부담 가중" },
    { id: 2, title: "신재생에너지 투자 확대 전망" },
    { id: 3, title: "EU, 탄소 국경세 본격 시행" },
    { id: 4, title: "국내 기업 온실가스 감축 성과 발표" },
    { id: 5, title: "수소 에너지 시장 급성장" },
    { id: 6, title: "글로벌 ESG 투자 3년 연속 증가" },
    { id: 7, title: "기후 변화 대응을 위한 국제 협약 체결" },
    { id: 8, title: "탄소 배출권 거래량 사상 최대치 기록" },
    { id: 9, title: "친환경 경영 도입 기업 급증" },
    { id: 10, title: "AI 기반 에너지 절감 기술 주목" },
    { id: 11, title: "해외 주요 기업 탄소 감축 로드맵 공개" },
  ];

  return (
    <div
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center p-6 items-center justify-center"
      style={{
        backgroundImage: "url('/images/dashboard-bg.jpg')",
      }}
    >
      {/* 메인 */}
      <div className="h-full w-full min-w-0 rounded-3xl backdrop-blur-[12px] bg-black/10 border border-white/20 shadow-2xl overflow-auto p-3">
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
        <main className="flex-1 mt-3 flex flex-col backdrop-blur-[8px] bg-black/10 border border-white/20 rounded-3xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼족 */}

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 전체 배출량 카드  */}
                <div className="lg:col-span-2">
                  <div className="mb-3">
                    <h2 className="text-xl font-bold text-white/90 mb-2">
                      전체 현황
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-white to-green-400"></div>
                  </div>

                  <div className="bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl px-6 py-4 border border-white/30 shadow-2xl relative overflow-hidden">
                    {/* 배경 장식 */}

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                          <Users className="w-8 h-8 text-white drop-shadow-sm" />
                        </div>
                        <div className="text-right">
                          <span className="text-white/70 text-sm font-medium">
                            Global Overview
                          </span>
                          <div className="w-2 h-2 bg-green-400 rounded-full ml-auto mt-1 animate-pulse"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-sm">
                            전체 배출량
                          </h3>
                          <p className="text-white/80 text-2xl font-semibold mb-1">
                            {companies.reduce(
                              (sum, company) =>
                                sum +
                                company.emissions.reduce(
                                  (s, e) => s + e.emissions,
                                  0
                                ),
                              0
                            )}{" "}
                            <span className="text-lg font-normal">tCO2</span>
                          </p>
                        </div>

                        <div className="border-l border-white/20 pl-6">
                          <p className="text-white/70 text-sm mb-1">
                            예상 탄소세
                          </p>
                          <p className="text-white font-bold text-xl">
                            $
                            {(
                              companies.reduce(
                                (sum, company) =>
                                  sum +
                                  company.emissions.reduce(
                                    (s, e) => s + e.emissions,
                                    0
                                  ),
                                0
                              ) * 50
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="border-l border-white/20 pl-6">
                          <p className="text-white/70 text-sm mb-1">
                            자회사 수
                          </p>
                          <p className="text-white font-bold text-xl">
                            {companies.length}개 회사
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 자회사 그룹 섹션 */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-white/90 mb-2">
                        자회사별 현황
                      </h2>
                      <div className="w-28 h-1 bg-gradient-to-r from-white to-green-400"></div>
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="회사명 검색"
                      className="w-[150px] p-2 pl-3 rounded-lg bg-black/20 text-white placeholder-white/50 border border-white/20 backdrop-blur-sm"
                    />
                  </div>

                  {/* 자회사 컨테이너 */}
                  <div className="relative">
                    <button
                      onClick={scrollLeftFn}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2 transition-all duration-300 shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={scrollRightFn}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2 transition-all duration-300 shadow-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    <div
                      ref={scrollRef}
                      className="flex gap-6 overflow-x-auto pb-4 overflow-x-hidden p-2"
                    >
                      {filteredCompanies.map((company, idx) => {
                        const { totalEmissions, monthlyData } =
                          parseCompanyEmissions(company);
                        const isActive = selectedCompanyId === company.id;
                        const colorScheme = [
                          "blue",
                          "emerald",
                          "amber",
                          "rose",
                          "indigo",
                          "teal",
                        ][idx % 6];

                        return (
                          <div
                            key={company.id}
                            onClick={() => handleCompanyClick(company.id)}
                            className={`flex-shrink-0 w-64 bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-xl rounded-xl border border-${colorScheme}-500/20 shadow-lg transition-all duration-300 group relative overflow-hidden ${
                              isActive ? "ring-1 ring-green-400" : ""
                            } cursor-pointer`}
                          >
                            {/* 카드 내부 */}
                            <div className="relative z-10 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div
                                  className={`bg-${colorScheme}-500/20 backdrop-blur-sm rounded-lg p-2`}
                                >
                                  <Building2 className="w-4 h-4 text-white/80" />
                                </div>
                                <div className="text-right">
                                  <span className="text-white/60 text-xs font-medium">
                                    {company.country}
                                  </span>
                                </div>
                              </div>
                              <h4 className="text-sm font-semibold text-white mb-3 truncate">
                                {company.name}
                              </h4>
                              <div className="space-y-2 mb-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-white/60 text-xs">
                                    총 배출량
                                  </span>
                                  <span
                                    className={`text-${colorScheme}-300 text-sm font-semibold`}
                                  >
                                    {totalEmissions} tCO2
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-1 max-h-24 overflow-y-auto mini-scrollbar">
                                {monthlyData.slice(0, 6).map((m) => (
                                  <div
                                    key={m.month}
                                    className="flex justify-between items-center text-xs"
                                  >
                                    <span className="text-white/50 font-medium">
                                      {m.month}
                                    </span>
                                    <span className="text-white/70 font-medium">
                                      {m.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* 오른쪽 - posts */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[200px] overflow-y-auto p-2 mini-scrollbar">
                    {posts
                      .filter((post) =>
                        selectedCompanyId
                          ? post.resourceUid === selectedCompanyId
                          : true
                      )
                      .map((post) => (
                        <div
                          key={post.id}
                          className="flex flex-col justify-between p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors h-[120px] bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl border border-white/20 "
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium text-sm">
                                {post.title}
                              </p>
                              <p className="text-white/60 text-xs">
                                {post.dateTime}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white/80 text-sm">
                              {post.content}
                            </p>
                            <button className="bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 px-3 py-1 rounded-full text-xs transition-colors">
                              상세보기
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 */}
            <div className="flex flex-col justify-between h-full">
              {/* 월별 배출량 */}
              <div className="bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  월별 배출량
                </h3>
                <div className="h-64">
                  <LineChartD3
                    companies={companies}
                    selectedCompanyId={selectedCompanyId}
                  />
                </div>
              </div>

              {/* 상세 정보 카드 */}
              {selectedCompanyId && (
                <div
                  className="h-[400px] group bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden cursor-pointer hover:scale-101 hover:shadow-2xl transition-transform duration-300"
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
                      const emissions = c.emissions;
                      const lastMonth = emissions.slice(-1)[0]?.emissions || 0;
                      const prevMonth =
                        emissions.slice(-2, -1)[0]?.emissions || 0;

                      const total = emissions.reduce(
                        (sum, e) => sum + e.emissions,
                        0
                      );

                      const totalCompanyValue = companies.reduce(
                        (sum, company) =>
                          sum +
                          company.emissions.reduce(
                            (s, e) => s + e.emissions,
                            0
                          ),
                        0
                      );

                      // 다른 기업 평균
                      const otherCompanies = companies.filter(
                        (comp) => comp.id !== c.id
                      );
                      const otherAverage =
                        otherCompanies.reduce(
                          (sum, comp) =>
                            sum + comp.emissions.slice(-1)[0]?.emissions || 0,
                          0
                        ) / otherCompanies.length;

                      // 같은 자회사의 평균
                      const sameCompanyAverage =
                        emissions.reduce((sum, e) => sum + e.emissions, 0) /
                        emissions.length;

                      const isAboveAverage = lastMonth > otherAverage;

                      return (
                        <div key={c.id}>
                          <HorizontalBarChart
                            lastMonth={lastMonth}
                            prevMonth={prevMonth}
                            sameCompanyAverage={sameCompanyAverage}
                            otherAverage={otherAverage}
                          />
                          <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-white/90">
                              회사명: {c.name}
                            </span>
                            <span className="px-2 py-1 bg-purple-500/20 backdrop-blur-md rounded-full text-xs text-white/90">
                              이번 달: {lastMonth} tCO2
                            </span>
                            <span className="px-2 py-1 bg-blue-500/20 backdrop-blur-md rounded-full text-xs text-white/90">
                              저번 달: {prevMonth} tCO2
                            </span>
                            <span className="px-2 py-1 bg-green-500/20 backdrop-blur-md rounded-full text-xs text-white/90">
                              전체 대비:{" "}
                              {((total / totalCompanyValue) * 100).toFixed(1)}%
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                isAboveAverage
                                  ? "bg-green-400/30 text-green-400"
                                  : "bg-red-400/30 text-red-400"
                              } backdrop-blur-md`}
                            >
                              {isAboveAverage
                                ? "다른 기업 평균보다 높음"
                                : "다른 기업 평균보다 낮음"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
              {!selectedCompanyId && (
                <div>
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg--500/20 rounded-full blur-3xl"></div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-green-400" />
                        헤드라인 뉴스 Top 10
                      </h3>
                      <div className="grid gap-8">
                        <div className=" backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                          {!selectedCompanyId && (
                            <div className="space-y-2 ">
                              <div className="overflow-hidden h-64 relative">
                                <ul className="space-y-3 text-white/80 text-sm animate-slide-up">
                                  {[...mockNews, ...mockNews]
                                    .slice(0, 20)
                                    .map((news, index) => (
                                      <li
                                        key={`${news.id}-${index}`}
                                        className="flex items-center space-x-2 py-1"
                                      >
                                        <div className="w-2 h-2 bg-green-700 rounded-full flex-shrink-0"></div>
                                        <span>{news.title}</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <style jsx>{`
                    @keyframes slide-up {
                      0% {
                        transform: translateY(0);
                      }
                      100% {
                        transform: translateY(-50%);
                      }
                    }

                    @keyframes marquee {
                      0% {
                        transform: translateX(0);
                      }
                      100% {
                        transform: translateX(-50%);
                      }
                    }

                    .animate-slide-up {
                      animation: slide-up 30s linear infinite;
                    }

                    .animate-marquee {
                      animation: marquee 45s linear infinite;
                    }
                  `}</style>
                </div>
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

"use client";

import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  companies,
  Company,
  Country,
  fetchCompanies,
  fetchCountries,
  fetchPosts,
  Post,
} from "@/lib/api";

const Dashboard = () => {
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

  const totalEmissionsAll = useMemo(
    () =>
      companies.reduce(
        (sum, c) => sum + parseCompanyEmissions(c).totalEmissions,
        0
      ),
    []
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  // 자회사 클릭 핸들러
  const handleCompanyClick = (companyId: string) => {
    setSelectedCompanyId((prev) => (prev === companyId ? null : companyId));
  };

  return (
    <div
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/dashboard-bg.jpg')",
      }}
    >
      {/* 사이드패널 */}
      {/* <div className="bg-amber-400">
        <h2>Companies</h2>
        <pre>{JSON.stringify(companies, null, 2)}</pre>

        <h2>Countries</h2>
        <pre>{JSON.stringify(countries, null, 2)}</pre>

        <h2>Posts</h2>
        <pre>{JSON.stringify(posts, null, 2)}</pre>
      </div> */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full backdrop-blur-[12px] bg-black/30  border-r border-white/20 shadow-2xl rounded-r-2xl">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-md">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
            </div>
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isDrawerOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {[
              { icon: Globe, label: "menu1", active: true },
              { icon: Building2, label: "menu2" },
              { icon: DollarSign, label: "menu3" },
              { icon: Target, label: "menu4" },
              { icon: AlertTriangle, label: "menu5" },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-white/20 shadow-inner"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 메인 */}
      <div className="flex-1 flex flex-col min-w-0 p-6">
        {/* 헤더 */}
        <header className="backdrop-blur-[12px] bg-black/30 border border-white/20 rounded-3xl px-6 py-4 flex items-center justify-between shadow-2xl mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-3 rounded-2xl hover:bg-white/10 transition-all duration-200 hover:scale-105"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>

            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                탄소 배출량 대시보드
              </h2>
              <p className="text-white/60">실시간 환경 영향 모니터링 시스템</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            >
              <option value="1month" className="bg-gray-800">
                1개월
              </option>
              <option value="3months" className="bg-gray-800">
                3개월
              </option>
              <option value="6months" className="bg-gray-800">
                6개월
              </option>
              <option value="1year" className="bg-gray-800">
                1년
              </option>
            </select>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </div>
        </header>

        {/* 대시보드 콘텐츠 */}
        <main className="flex-1 mt-6 flex flex-col backdrop-blur-[8px] bg-black/30 border border-white/20 rounded-3xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼족 */}

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 전체 배출량 카드  */}
                <div className="lg:col-span-2">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-white/90 mb-2">
                      전체 현황
                    </h2>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-purple-400 to-blue-500 mx-auto"></div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-500/60 to-black-500/60 backdrop-blur-xl rounded-3xl px-6 py-4 border border-white/30 shadow-2xl relative overflow-hidden">
                    {/* 배경 장식 */}

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
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
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white/90 mb-2">
                        자회사별 현황
                      </h2>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
                    </div>
                    <span className="text-white/60 text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      {companies.length}개 자회사
                    </span>
                  </div>

                  {/* 자회사 컨테이너 */}
                  <div className="relative ">
                    {/* 좌우 페이드 효과 */}

                    <div className="flex gap-6 overflow-x-auto pb-4 horizontal-scrollbar p-2">
                      {companies.map((company, idx) => {
                        const { totalEmissions, monthlyData } =
                          parseCompanyEmissions(company);
                        const colors = [
                          {
                            gradient: "from-slate-700/60 to-slate-800/60",
                            accent: "bg-blue-500/20",
                            border: "border-blue-500/20",
                            text: "text-blue-300",
                          },
                          {
                            gradient: "from-slate-700/60 to-slate-800/60",
                            accent: "bg-emerald-500/20",
                            border: "border-emerald-500/20",
                            text: "text-emerald-300",
                          },
                          {
                            gradient: "from-slate-700/60 to-slate-800/60",
                            accent: "bg-amber-500/20",
                            border: "border-amber-500/20",
                            text: "text-amber-300",
                          },
                          {
                            gradient: "from-slate-700/60 to-slate-800/60",
                            accent: "bg-rose-500/20",
                            border: "border-rose-500/20",
                            text: "text-rose-300",
                          },
                          {
                            gradient: "from-slate-700/60 to-slate-800/60",
                            accent: "bg-indigo-500/20",
                            border: "border-indigo-500/20",
                            text: "text-indigo-300",
                          },
                          {
                            gradient: "from-slate-700/60 to-slate-800/60",
                            accent: "bg-teal-500/20",
                            border: "border-teal-500/20",
                            text: "text-teal-300",
                          },
                        ];
                        const colorScheme = colors[idx % colors.length];
                        const isActive = selectedCompanyId === company.id;
                        return (
                          <div
                            key={company.id}
                            onClick={() => handleCompanyClick(company.id)}
                            className={`
                              flex-shrink-0 w-64 bg-gradient-to-br ${
                                colorScheme.gradient
                              } backdrop-blur-xl rounded-xl border ${
                              colorScheme.border
                            } shadow-lg transition-all duration-300 group relative overflow-hidden
                              ${isActive ? "ring-1 ring-blue-400" : ""}
                              cursor-pointer
                            `}
                          >
                            {/* 카드 */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent"></div>
                            <div
                              className={`absolute top-0 left-0 w-0.5 h-full ${colorScheme.accent}`}
                            ></div>

                            <div className="relative z-10 p-4">
                              {/* 헤더 */}
                              <div className="flex items-center justify-between mb-3">
                                <div
                                  className={`${colorScheme.accent} backdrop-blur-sm rounded-lg p-2 group-hover:scale-105 transition-transform duration-300`}
                                >
                                  <Building2 className="w-4 h-4 text-white/80" />
                                </div>
                                <div className="text-right">
                                  <span className="text-white/60 text-xs font-medium">
                                    {company.country}
                                  </span>
                                </div>
                              </div>

                              {/* 회사명*/}
                              <h4 className="text-sm font-semibold text-white mb-3 truncate group-hover:text-white/90 transition-colors">
                                {company.name}
                              </h4>

                              {/* 정보*/}
                              <div className="space-y-2 mb-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-white/60 text-xs">
                                    총 배출량
                                  </span>
                                  <span
                                    className={`${colorScheme.text} text-sm font-semibold`}
                                  >
                                    {totalEmissions} tCO2
                                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-white/60 text-xs">
                                    예상 탄소세
                                  </span>
                                  <span className="text-white/80 text-xs font-medium">
                                    ${(totalEmissions * 50).toLocaleString()}
                                  </span>
                                </div>

                                <div className="w-full h-px bg-white/10 my-2"></div>
                              </div>

                              {/* 월별 데이터 */}
                              <div className="space-y-1">
                                <h5 className="text-white/70 text-xs font-medium mb-2 flex items-center gap-1">
                                  <div className="w-2 h-px bg-white/30 rounded"></div>
                                  월별 현황
                                </h5>

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
                                  {monthlyData.length > 6 && (
                                    <div className="text-center">
                                      <span className="text-white/40 text-xs">
                                        +{monthlyData.length - 6}개월
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 -1 */}
            <div className="space-y-6">
              {/* 오른쪽 -2 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4">
                  월별 배출량
                </h3>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={
                        selectedCompanyId
                          ? companies
                              .find((c) => c.id === selectedCompanyId)
                              ?.emissions.map((e) => ({
                                month: e.yearMonth,
                                emissions: e.emissions,
                              })) || []
                          : companies
                              .map((c) =>
                                c.emissions.map((e) => ({
                                  month: e.yearMonth,
                                  emissions: e.emissions,
                                }))
                              )
                              .flat()
                      }
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                      <XAxis
                        dataKey="month"
                        stroke="#ffffff80"
                        tick={{ fill: "#ffffffaa" }}
                      />
                      <YAxis
                        stroke="#ffffff80"
                        tick={{ fill: "#ffffffaa" }}
                        unit="tCO2"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#00000080",
                          border: "none",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="emissions"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 오른쪽 - posts */}
              <div className="space-y-4">
                {posts
                  .filter((post) =>
                    selectedCompanyId
                      ? post.resourceUid === selectedCompanyId
                      : true
                  )
                  .map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
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
                        <p className="text-white/80 text-sm">{post.content}</p>
                        <button className="bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 px-3 py-1 rounded-full text-xs transition-colors">
                          상세보기
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
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

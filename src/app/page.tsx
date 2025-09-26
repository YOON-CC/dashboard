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

  // const [companies, setCompanies] = useState<Company[]>([]);
  // const [countries, setCountries] = useState<Country[]>([]);
  // const [posts, setPosts] = useState<Post[]>([]);
  // useEffect(() => {
  //   fetchCompanies().then(setCompanies);
  //   fetchCountries().then(setCountries);
  //   fetchPosts().then(setPosts);
  // }, []);

  const companies = [
    {
      id: "c1",
      name: "Acme Corp",
      country: "US",
      emissions: [
        {
          yearMonth: "2024-01",
          source: "gasoline",
          emissions: 120,
        },
        {
          yearMonth: "2024-02",
          source: "diesel",
          emissions: 110,
        },
        {
          yearMonth: "2024-03",
          source: "lpg",
          emissions: 95,
        },
      ],
    },
    {
      id: "c2",
      name: "Globex",
      country: "DE",
      emissions: [
        {
          yearMonth: "2024-01",
          source: "diesel",
          emissions: 80,
        },
        {
          yearMonth: "2024-02",
          source: "gasoline",
          emissions: 105,
        },
        {
          yearMonth: "2024-03",
          source: "lpg",
          emissions: 120,
        },
      ],
    },
  ];

  const countries = [
    {
      code: "US",
      name: "United States",
    },
    {
      code: "DE",
      name: "Germany",
    },
    {
      code: "KR",
      name: "Korea",
    },
  ];

  const posts = [
    {
      id: "p1",
      title: "Sustainability Report",
      resourceUid: "c1",
      dateTime: "2024-02",
      content: "Quarterly CO2 update",
    },
  ];

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
        <header className="backdrop-blur-[8px] bg-black/30 border border-white/20 rounded-2xl px-3 py-2 flex items-center justify-between shadow-xl">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isDrawerOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

            <div>
              <h2 className="text-2xl font-bold text-white">Dashboard</h2>
              <p className="text-gray-300">대시보드</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="1month" className="bg-gray-800">
                1
              </option>
              <option value="3months" className="bg-gray-800">
                2
              </option>
              <option value="6months" className="bg-gray-800">
                3
              </option>
              <option value="1year" className="bg-gray-800">
                4
              </option>
            </select>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center shadow-md">
              <span className="text-white font-medium">A</span>
            </div>
          </div>
        </header>

        {/* 대시보드 콘텐츠 */}
        <main className="flex-1 mt-6 flex flex-col backdrop-blur-[8px] bg-black/30 border border-white/20 rounded-3xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼족 */}

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/30 to-blue-600/30 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-white/20 rounded-full p-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white/70 text-sm">...</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    전체 배출량
                  </h3>
                  <p className="text-white/70 text-sm mb-2">
                    {totalEmissionsAll} tCO2
                  </p>
                  <div className="flex items-center text-green-300 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.3%
                  </div>
                </div>
                {companies.map((company) => {
                  const { totalEmissions, monthlyData } =
                    parseCompanyEmissions(company);
                  return (
                    <div
                      key={company.id}
                      className="bg-gradient-to-br from-blue-500/30 to-blue-600/30 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-full p-3">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white/70 text-sm">
                          {company.country}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {company.name}
                      </h3>
                      <p className="text-white/70 text-sm mb-2">
                        총 배출량: {totalEmissions} tCO2
                      </p>
                      <div className="flex flex-col space-y-1">
                        {monthlyData.map((m) => (
                          <div
                            key={m.month}
                            className="flex justify-between text-white/70 text-xs"
                          >
                            <span>{m.month}</span>
                            <span>{m.value} tCO2</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 왼쪽 하단 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-white">content</h3>
                  <button className="text-white/70 hover:text-white transition-colors">
                    ...
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <span className="text-white/80">content</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-white/70">content</span>
                      <div className="w-8 h-8 bg-blue-500/30 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-300" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-white/80">content</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-white/70">content</span>
                      <div className="w-8 h-8 bg-green-500/30 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-300" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* 왼쪽 하단 */}
              {/* <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4">
                  content
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-white/80 text-sm">content</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-16 h-8" viewBox="0 0 100 40">
                      <path
                        d="M0,20 Q25,10 50,20 T100,20"
                        stroke="#60a5fa"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle cx="50" cy="20" r="3" fill="#60a5fa" />
                    </svg>
                    <span className="text-white/70 text-sm">Solved</span>
                  </div>
                </div>
              </div> */}
            </div>

            {/* 오른쪽 -1 */}
            <div className="space-y-6">
              {/* Calendar */}
              {/* <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">content</h3>
                  <span className="text-white/70 text-sm">content</span>
                </div>

                <div className="grid grid-cols-7 gap-1 text-xs text-white/60 mb-2">
                  <div className="text-center p-1">S</div>
                  <div className="text-center p-1">M</div>
                  <div className="text-center p-1">T</div>
                  <div className="text-center p-1">W</div>
                  <div className="text-center p-1">T</div>
                  <div className="text-center p-1">F</div>
                  <div className="text-center p-1">S</div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-sm">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 5;
                    const isCurrentMonth = day > 0 && day <= 31;
                    const isToday = day === 1;

                    return (
                      <div
                        key={i}
                        className={`text-center p-2 rounded-lg ${
                          isCurrentMonth
                            ? isToday
                              ? "bg-blue-500 text-white"
                              : "text-white/80 hover:bg-white/10"
                            : "text-white/30"
                        }`}
                      >
                        {isCurrentMonth ? day : day <= 0 ? 31 + day : day - 31}
                      </div>
                    );
                  })}
                </div>
              </div> */}

              {/* 오른쪽 -2 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4">
                  content
                </h3>

                <div className="relative h-32 mb-4">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <path
                      d="M0,60 Q50,20 100,40 T200,30"
                      stroke="#60a5fa"
                      strokeWidth="3"
                      fill="none"
                      className="drop-shadow-lg"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#60a5fa"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#60a5fa"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,60 Q50,20 100,40 T200,30 L200,80 L0,80 Z"
                      fill="url(#gradient)"
                    />
                  </svg>
                  <div className="absolute top-4 left-4 bg-blue-500/30 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs">content</span>
                  </div>
                </div>
              </div>

              {/* 오른쪽 -3 */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">content</h3>
                  <button className="text-white/70 hover:text-white">
                    ...
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "name",
                      gender: "gender",
                      age: "age",
                      avatar: "avatar",
                    },
                    {
                      name: "name",
                      gender: "gender",
                      age: "age",
                      avatar: "avatar",
                    },
                    {
                      name: "Pname",
                      gender: "gender",
                      age: "age",
                      avatar: "avatar",
                    },
                  ].map((patient, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {patient.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {patient.name}
                          </p>
                          <p className="text-white/60 text-xs">
                            {patient.gender}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/80 text-sm">{patient.age}</p>
                        <button className="bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 px-3 py-1 rounded-full text-xs transition-colors">
                          content
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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

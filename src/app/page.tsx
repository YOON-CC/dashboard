"use client";

import React, { useState } from "react";
import {
  Leaf,
  AlertTriangle,
  Building2,
  Menu,
  X,
  DollarSign,
  Target,
  Globe,
} from "lucide-react";

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  return (
    <div
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/dashboard-bg.jpg')",
      }}
    >
      {/* 사이드패널 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full backdrop-blur-[12px] bg-white/10 border-r border-white/20 shadow-2xl rounded-r-2xl">
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
        <header className="backdrop-blur-[8px] bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-xl">
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
        <main className="flex-1 mt-6 flex flex-col">
          <div className="backdrop-blur-[8px] bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl flex-1 flex flex-col space-y-6">
            {/* 미리보기 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "전체", subtitle: "This month", value: "1,234 tCO₂e" },
                { title: "합계", subtitle: "Projected", value: "₩12,345,678" },
                {
                  title: "퍼센트",
                  subtitle: "Compared to last month",
                  value: "87.2%",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-between"
                >
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">{card.subtitle}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-md flex-1 flex items-center justify-center">
              <div className="w-full h-full backdrop-blur-[8px] bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-gray-400">
                내용1
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-md flex-1 flex items-center justify-center">
              <div className="w-full h-full backdrop-blur-[8px] bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-gray-400">
                내용2
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

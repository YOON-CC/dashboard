"use client";

import React, { useState, useEffect } from "react";

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
    // <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 relative overflow-hidden">
    <div
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/dashboard-bg.jpg')",
      }}
    >
      {/* 사이드패널 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform  ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-64"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-2xl">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
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
                    ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-white/20"
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
      <div className="flex-1 flex flex-col min-w-0 p-4">
        {/* 헤더 */}
        <header className="backdrop-blur-[5px] bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-lg">
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">A</span>
            </div>
          </div>
        </header>

        {/* 대시보드 주 내용 */}
        <main className="flex-1 mt-4 overflow-auto">
          <div className="backdrop-blur-[5px] bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg space-y-6 min-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-white font-semibold text-lg mb-2">전체</h3>
                <p className="text-gray-300 text-sm mb-4">This month</p>
                <p className="text-2xl font-bold text-white">1,234 tCO₂e</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-white font-semibold text-lg mb-2">합계</h3>
                <p className="text-gray-300 text-sm mb-4">Projected</p>
                <p className="text-2xl font-bold text-white">₩12,345,678</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-white font-semibold text-lg mb-2">
                  퍼센트
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Compared to last month
                </p>
                <p className="text-2xl font-bold text-white">87.2%</p>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-md">
              <h3 className="text-white font-semibold text-lg mb-4">제목1</h3>
              <div className="w-full h-64 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                내용
              </div>
            </div>

            {/* 다른 콘텐츠도 이 안에 추가 가능 */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 shadow-md">
              <h3 className="text-white font-semibold text-lg mb-4">제목1</h3>
              <div className="w-full h-48 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                내용
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 반응형 */}
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

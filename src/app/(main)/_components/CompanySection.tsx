/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import CompanySectionSkeleton from "../_ui/CompanySectionSkeleton";
import CompanyCardSkeleton from "../_ui/CompanySectionSkeleton";
import PostCardSkeleton from "../_ui/PostCardSkeleton";

interface CompanySectionProps {
  search: string;
  setSearch: (value: string) => void;
  filteredCompanies: any[];
  selectedCompanyId: string | null;
  handleCompanyClick: (companyId: string) => void;
  parseCompanyEmissions: (company: any) => {
    totalEmissions: number;
    monthlyData: { month: string; value: number }[];
  };
  posts: any[];
}

const CompanySection = ({
  search,
  setSearch,
  filteredCompanies,
  selectedCompanyId,
  handleCompanyClick,
  parseCompanyEmissions,
  posts,
}: CompanySectionProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeftFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRightFn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="lg:col-span-2">
      {/* 헤더 */}
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

      {/* 자회사 카드 리스트 */}
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

        <div ref={scrollRef} className="flex gap-6 pb-4 overflow-x-hidden p-2">
          {filteredCompanies && filteredCompanies.length > 0
            ? filteredCompanies.map((company, idx) => {
                const { totalEmissions, monthlyData } =
                  parseCompanyEmissions(company);
                const isActive = selectedCompanyId === company.id;

                return (
                  <div
                    key={company.id}
                    onClick={() => handleCompanyClick(company.id)}
                    className={`flex-shrink-0 w-64 bg-gradient-to-br from-slate-700/60 to-slate-800/60 backdrop-blur-xl rounded-xl shadow-lg transition-all duration-300 group relative overflow-hidden hover:shadow-2xl hover:scale-105 cursor-pointer
                    ${
                      isActive
                        ? `border-2 border-white`
                        : `border border-slate-700/60`
                    }`}
                  >
                    {/* 실제 카드 내용 */}
                    <div className="relative z-10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`bg-white backdrop-blur-sm rounded-lg p-2`}
                        >
                          <Building2 className="w-4 h-4 text-black" />
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
                          <span className={`text-white text-sm font-semibold`}>
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
              })
            : // Skeleton
              Array.from({ length: 5 }).map((_, idx) => (
                <CompanyCardSkeleton key={idx} />
              ))}
        </div>
      </div>

      {/* Posts 리스트 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-[200px] overflow-y-auto p-2 mini-scrollbar">
        {posts && posts.length > 0
          ? posts
              .filter((post) =>
                selectedCompanyId
                  ? post.resourceUid === selectedCompanyId
                  : true
              )
              .map((post) => (
                <div
                  key={post.id}
                  className="flex flex-col justify-between p-3 rounded-xl cursor-pointer hover:bg-white/10 transition-colors h-fit bg-gradient-to-br from-black/20 to-black/40 backdrop-blur-xl border border-white/20"
                >
                  {/* 상단 아이콘과 타이틀 */}
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
                      <p className="text-white/60 text-xs">{post.dateTime}</p>
                    </div>
                  </div>

                  {/* 내용과 버튼 */}
                  <div className="text-right">
                    <p className="text-white/80 text-sm">{post.content}</p>
                    <button className="bg-blue-500/30 hover:bg-blue-500/50 text-blue-200 px-3 py-1 rounded-full text-xs transition-colors mt-2">
                      상세보기
                    </button>
                  </div>
                </div>
              ))
          : Array.from({ length: 6 }).map((_, idx) => (
              <PostCardSkeleton key={idx} />
            ))}
      </div>
    </div>
  );
};

export default CompanySection;

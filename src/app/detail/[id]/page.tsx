"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Company, fetchCompanies, fetchPosts, Post } from "@/lib/api";
import SidePanel from "@/components/layout/SidePanel";
import Header from "@/components/layout/Header";
import * as d3 from "d3";
import PieChart from "./components/PieChart";
import { Globe } from "lucide-react";
import LineChartD3 from "@/app/(main)/_components/BarChartD3";
import BarChartD3 from "@/app/(main)/_components/BarChartD3";
import HorizontalBarChart from "@/app/(main)/_components/HorizontalBarChart";
import CompanyStatsBar from "@/app/(main)/_ui/CompanyStatsBar";
import { calculateCompanyStatistics } from "@/app/(main)/utils/statistics";
export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id;

  const [showDetailDropdown, setShowDetailDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const pieRef = useRef<SVGSVGElement | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // 데이터 로딩
  useEffect(() => {
    fetchCompanies().then(setCompanies);
    fetchPosts().then(setPosts);
  }, []);

  useEffect(() => {
    fetchCompanies().then((data) => {
      setCompanies(data);
      const selected = data.find((c) => c.id === companyId);
      setCompany(selected || null);
    });
  }, [companyId]);

  // D3 원형 그래프
  useEffect(() => {
    if (!company || !pieRef.current) return;

    const svg = d3.select(pieRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // source별 총 배출량 계산
    const totalBySource = d3.rollup(
      company.emissions,
      (v) => d3.sum(v, (d) => d.emissions),
      (d) => d.source
    );

    const data = Array.from(totalBySource, ([source, value]) => ({
      source,
      value,
    }));

    const color: Record<string, string> = {
      gasoline: "#facc15",
      diesel: "#4ade80",
      lpg: "#38bdf8",
      electric: "#f472b6",
    };

    const pie = d3
      .pie<{ source: string; value: number }>()
      .value((d) => d.value);
    const arc = d3
      .arc<d3.PieArcDatum<{ source: string; value: number }>>()
      .innerRadius(0)
      .outerRadius(radius);

    g.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color[d.data.source] || "#888")
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .append("title")
      .text((d) => `${d.data.source}: ${d.data.value}`);
  }, [company]);

  if (!company) return <div>Loading...</div>;

  return (
    <div
      className="flex min-h-screen relative overflow-hidden bg-cover bg-center p-6 items-center justify-center"
      style={{ backgroundImage: "url('/images/dashboard-bg.jpg')" }}
    >
      <div className="h-full w-full min-w-0 rounded-3xl backdrop-blur-[12px] bg-black/10 border border-white/20 shadow-2xl overflow-auto p-3">
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
          isDetailPage={company.name}
        />

        <div className="h-[820px] flex gap-4">
          {/* 왼쪽: 회사 정보 */}
          <div className="flex-1 p-6 rounded-xl flex flex-col gap-6 shadow-inner">
            {/* 회사 기본 정보 */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/50 flex items-center justify-center text-white text-2xl font-bold">
                {company.name[0]}
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">
                  {company.name}
                </h2>
                <p className="text-white/80">Country: {company.country}</p>
              </div>
            </div>

            {/* 핵심 배출 지표 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 rounded-lg p-3 flex flex-col items-center">
                <h4 className="text-white/90 text-sm font-semibold">
                  총 배출량
                </h4>
                <p className="text-green-400 text-xl font-bold">
                  {company.emissions.reduce((sum, e) => sum + e.emissions, 0)}{" "}
                  tCO₂
                </p>
              </div>
              <div className="bg-black/50 rounded-lg p-3 flex flex-col items-center">
                <h4 className="text-white/90 text-sm font-semibold">
                  평균 배출량
                </h4>
                <p className="text-blue-400 text-xl font-bold">
                  {(
                    company.emissions.reduce((sum, e) => sum + e.emissions, 0) /
                    company.emissions.length
                  ).toFixed(2)}{" "}
                  tCO₂
                </p>
              </div>
            </div>

            {/* 최근 리포트 */}
            <div className="bg-black/40 p-3 rounded-lg flex flex-col gap-2 text-white/80">
              <h4 className="text-white font-semibold">최근 리포트</h4>
              {posts
                .filter((p) => p.resourceUid === company.id)
                .sort((a, b) => (a.dateTime < b.dateTime ? 1 : -1))
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-black/30 p-2 rounded-md hover:bg-green-500/20 cursor-pointer transition"
                    onClick={() =>
                      setSelectedReportId((prev) =>
                        prev === p.id ? null : p.id
                      )
                    }
                  >
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-white/60">{p.dateTime}</p>
                    {/* 선택된 리포트 내용 표시 */}
                    {selectedReportId === p.id && (
                      <div className="bg-black/50 p-3 rounded-md text-white/80 text-sm mt-2">
                        {p.content}
                      </div>
                    )}
                  </div>
                ))}
              {posts.filter((p) => p.resourceUid === company.id).length ===
                0 && (
                <p className="text-white/50 text-sm">리포트가 없습니다.</p>
              )}
            </div>

            {/* 주요 배출원 */}
            <div className="flex flex-col gap-2 text-white/80">
              <p>
                주요 배출원:{" "}
                {company.emissions.sort((a, b) => b.emissions - a.emissions)[0]
                  ?.source || "N/A"}
              </p>
              <p>
                최근 배출월:{" "}
                {
                  company.emissions.sort((a, b) =>
                    b.yearMonth.localeCompare(a.yearMonth)
                  )[0]?.yearMonth
                }
              </p>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-green-500/70 hover:bg-green-400 transition rounded-lg py-2 text-white font-semibold">
                Export Report
              </button>
            </div>
          </div>

          {/* 오른쪽 */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 h-full p-4 rounded-xl">
            {/* 위쪽 2칸 */}
            <div className="bg-black/30 flex flex-col items-center justify-center rounded-2xl">
              <h3 className="text-white text-xl font-bold mb-2">배출 원천</h3>
              <PieChart
                data={Array.from(
                  d3.rollup(
                    company.emissions,
                    (v) => d3.sum(v, (d) => d.emissions),
                    (d) => d.source
                  ),
                  ([source, value]) => ({ source, value })
                )}
              />
            </div>

            <div className="bg-black/30 flex flex-col items-center justify-center rounded-2xl">
              <BarChartD3
                companies={companies}
                selectedCompanyId={companyId}
                isDetailPage={true}
              />
            </div>

            {/* 아래쪽 1칸, 전체 너비 차지 */}
            <div className="bg-black/30 flex flex-col items-center justify-center rounded-2xl col-span-2">
              {companies
                .filter((c) => c.id === companyId)
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
          </div>
        </div>
      </div>
    </div>
  );
}

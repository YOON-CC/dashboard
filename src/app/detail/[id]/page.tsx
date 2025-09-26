"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Company, fetchCompanies } from "@/lib/api";
import SidePanel from "@/components/layout/SidePanel";
import Header from "@/components/layout/Header";
import * as d3 from "d3";
import PieChart from "./components/PieChart";
import { Globe } from "lucide-react";
import LineChartD3 from "@/app/(main)/_components/BarChartD3";
import BarChartD3 from "@/app/(main)/_components/BarChartD3";
export default function CompanyDetailPage() {
  const params = useParams();
  const companyId = params.id;

  const [showDetailDropdown, setShowDetailDropdown] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [company, setCompany] = useState<Company | null>(null);

  const pieRef = useRef<SVGSVGElement | null>(null);

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
        <Header isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />

        <div className="h-[820px] flex gap-4">
          {/* 왼쪽: 회사 정보 */}
          <div className="flex-1 bg-black/30 p-4 rounded-xl flex flex-col gap-4">
            <h2 className="text-white text-2xl font-bold">{company.name}</h2>
            <p className="text-white/80">Country: {company.country}</p>
          </div>

          {/* 오른쪽 */}
          {/* <div className="flex-1 p-4 rounded-xl flex flex-col items-center justify-center">
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
          </div> */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4 h-full p-4 rounded-xl">
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
              <BarChartD3 companies={companies} selectedCompanyId={companyId} />
            </div>
            <div className="bg-green-400 flex items-center justify-center">
              3번 영역
            </div>
            <div className="bg-yellow-400 flex items-center justify-center">
              4번 영역
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { Company } from "@/lib/api";

interface BarChartD3Props {
  companies: Company[];
  selectedCompanyId?: string | null;
}

const BarChartD3: React.FC<BarChartD3Props> = ({
  companies,
  selectedCompanyId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 300 });
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    month: string;
    emissions: number;
  } | null>(null);

  // 반응형 처리
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const margin = { top: 20, right: 20, bottom: 50, left: 70 };

  // 데이터 준비
  let chartData: { month: string; emissions: number }[] = [];

  if (selectedCompanyId) {
    const company = companies.find((c) => c.id === selectedCompanyId);
    chartData = company
      ? company.emissions.map((e) => ({
          month: e.yearMonth,
          emissions: e.emissions,
        }))
      : [];
  } else {
    // 전체 회사 월별 합산
    const allMonths = Array.from(
      new Set(companies.flatMap((c) => c.emissions.map((e) => e.yearMonth)))
    ).sort();
    chartData = allMonths.map((month) => ({
      month,
      emissions: companies.reduce(
        (sum, c) =>
          sum +
          (c.emissions.find((e) => e.yearMonth === month)?.emissions || 0),
        0
      ),
    }));
  }

  // 스케일
  const xScale = d3
    .scaleBand()
    .domain(chartData.map((d) => d.month))
    .range([margin.left, dimensions.width - margin.right])
    .padding(0.3);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(chartData, (d) => d.emissions) || 0])
    .nice()
    .range([dimensions.height - margin.bottom, margin.top]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-4"
    >
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
        {/* X축 */}
        <g>
          {xScale.domain().map((month, i) => (
            <text
              key={i}
              x={(xScale(month) || 0) + xScale.bandwidth() / 2}
              y={dimensions.height - margin.bottom + 20}
              fill="#ffffffaa"
              textAnchor="middle"
              fontSize={12}
            >
              {month}
            </text>
          ))}
        </g>

        {/* Y축 */}
        <g>
          {yScale.ticks(5).map((tickValue, i) => (
            <g key={i}>
              <line
                x1={margin.left}
                x2={dimensions.width - margin.right}
                y1={yScale(tickValue)}
                y2={yScale(tickValue)}
                stroke="#ffffff20"
                strokeDasharray="3 3"
              />
              <text
                x={margin.left - 10}
                y={yScale(tickValue)}
                fill="#ffffffaa"
                textAnchor="end"
                fontSize={12}
                dy={4}
              >
                {tickValue} tCO2
              </text>
            </g>
          ))}
        </g>

        {/* 막대그래프 */}
        {chartData.map((d, i) => (
          <rect
            key={i}
            x={xScale(d.month)}
            y={yScale(d.emissions)}
            width={xScale.bandwidth()}
            height={dimensions.height - margin.bottom - yScale(d.emissions)}
            rx={4}
            ry={4}
            fill="url(#barGradient)"
            className="cursor-pointer transition-transform duration-200 hover:scale-y-105 hover:fill-white"
            onMouseEnter={(e) => {
              if (!svgRef.current) return;
              const rect = svgRef.current.getBoundingClientRect();
              setTooltip({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                month: d.month,
                emissions: d.emissions,
              });
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}

        {/* 그라디언트 정의 */}
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2f4f4f" stopOpacity={0.8} />
            <stop offset="100%" stopColor="##00ffaa" stopOpacity={0.4} />
          </linearGradient>
        </defs>
      </svg>

      {/* 툴팁 */}
      {tooltip && (
        <div
          className="absolute bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none shadow-lg"
          style={{
            top: tooltip.y - 40,
            left: tooltip.x + 10,
          }}
        >
          <div className="font-semibold">{tooltip.month}</div>
          <div>{tooltip.emissions} tCO2</div>
        </div>
      )}
    </div>
  );
};

export default BarChartD3;

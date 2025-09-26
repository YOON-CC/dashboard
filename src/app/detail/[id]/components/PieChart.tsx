"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PieChartProps {
  data: { source: string; value: number }[];
  width?: number;
  height?: number;
}

const colors: Record<string, string> = {
  gasoline: "rgba(0,0,0,0.5)", // 검정 50% 투명
  diesel: "rgba(0,0,0,0.5)",
  lpg: "rgba(0,0,0,0.5)",
  electric: "rgba(0,0,0,0.5)",
};
export default function PieChart({
  data,
  width = 400,
  height = 400,
}: PieChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = 20; // 여백
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", "70%")
      .attr("height", "70%")
      .attr("viewBox", `0 0 ${width} ${height}`) // 반응형
      .style("overflow", "visible"); // 잘리는 문제 방지

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<{ source: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ source: string; value: number }>>()
      .innerRadius(radius * 0.3)
      .outerRadius(radius);

    const arcs = g
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("fill", (d) => colors[d.data.source] || "rgba(0,0,0,0.5)")
      .attr("stroke", "#222")
      .attr("stroke-width", 1);

    // 애니메이션
    arcs
      .transition()
      .duration(800)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t))!;
      });

    // 라벨
    g.selectAll("text")
      .data(pie(data))
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", 20)
      .text((d) => `${d.data.source}: ${d.data.value}`);

    // 툴팁
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "4px 8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("font-size", "12px");

    return () => tooltip.remove();
  }, [data, width, height]);

  return <svg ref={svgRef} />;
}

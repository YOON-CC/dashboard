"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface PieChartProps {
  data: { source: string; value: number }[];
}

const colors: Record<string, string> = {
  gasoline: "#22c55e",
  diesel: "#3b82f6",
  lpg: "#f59e0b",
  electric: "#8b5cf6",
  // 기본값들
  default1: "#ef4444",
  default2: "#06b6d4",
  default3: "#84cc16",
  default4: "#f97316",
};

export default function PieChart({ data }: PieChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height);

    const margin = 10;
    const radius = (size - margin * 2) / 2 - 20;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", size)
      .attr("height", size)
      .style("max-width", "100%")
      .style("max-height", "100%");

    const g = svg
      .append("g")
      .attr("transform", `translate(${size / 2}, ${size / 2})`);

    const pie = d3
      .pie<{ source: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ source: string; value: number }>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    // 색상 배열 생성
    const colorKeys = Object.keys(colors);
    const getColor = (source: string, index: number) => {
      return (
        colors[source] ||
        colors[colorKeys[index % colorKeys.length]] ||
        "#64748b"
      );
    };

    const arcs = g
      .selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("fill", (d, i) => getColor(d.data.source, i))
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .style("opacity", 0.8);

    // 애니메이션
    arcs
      .transition()
      .duration(800)
      .attrTween("d", function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t))!;
      });

    // 라벨
    if (radius > 40) {
      g.selectAll("text")
        .data(pie(data))
        .join("text")
        .attr("transform", (d) => {
          const centroid = arc.centroid(d);
          return `translate(${centroid[0] * 1.2}, ${centroid[1] * 1.2})`;
        })
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .attr("font-size", Math.max(10, radius / 8))
        .attr("font-weight", "bold")
        .text((d) => {
          const percentage = (
            (d.data.value / d3.sum(data, (d) => d.value)) *
            100
          ).toFixed(1);
          return `${percentage}%`;
        })
        .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)");
    }

    // 툴팁
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0,0,0,0.9)")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("font-size", "12px")
      .style("z-index", "1000")
      .style("border", "1px solid rgba(255,255,255,0.2)");

    arcs
      .on("mouseover", function (event, d) {
        d3.select(this).style("opacity", 1);
        const percentage = (
          (d.data.value / d3.sum(data, (d) => d.value)) *
          100
        ).toFixed(1);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.data.source}</strong><br/>값: ${d.data.value}<br/>비율: ${percentage}%`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.8);
        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white/60 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ minHeight: 0, minWidth: 0 }}
    >
      <svg ref={svgRef} className="block" />
    </div>
  );
}

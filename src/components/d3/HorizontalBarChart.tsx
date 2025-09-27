import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface HorizontalBarChartProps {
  prevMonth: number;
  lastMonth: number;
  sameCompanyAverage: number;
  otherAverage: number;
}

const HorizontalBarChart = ({
  prevMonth,
  lastMonth,
  sameCompanyAverage,
  otherAverage,
}: HorizontalBarChartProps) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const width = containerWidth;
    const height = 250;
    const margin = { top: 30, right: 60, bottom: 40, left: 140 };

    const data = [
      { label: "저번 달", value: prevMonth, color: "#3B82F6" },
      { label: "이번 달", value: lastMonth, color: "#8B5CF6" },
      { label: "자회사 평균", value: sameCompanyAverage, color: "#10B981" },
      { label: "다른 기업 평균", value: otherAverage, color: "#FBBF24" },
    ];

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height);

    const xMax = d3.max(data, (d) => d.value)! * 1.2;

    const x = d3
      .scaleLinear()
      .domain([0, xMax])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    // Y축
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", 14)
      .attr("font-weight", 500);

    svg.select(".domain").remove();

    // X축
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(6))
      .selectAll("text")
      .attr("fill", "white")
      .attr("font-size", 12);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", 12)
      .attr("opacity", 0.7)
      .text("tCO2");

    const bars = svg
      .selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.label)!)
      .attr("x", x(0))
      .attr("height", y.bandwidth())
      .attr("width", (d) => x(d.value) - x(0))
      .attr("fill", (d) => d.color)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("opacity", 0.8);

    bars
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 1)
          .attr("transform", "scale(1.02)");
      })
      .on("mouseout", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("opacity", 0.8)
          .attr("transform", "scale(1)");
      });

    const labels = svg
      .selectAll(".label")
      .data(data)
      .join("g")
      .attr("class", "label");

    labels
      .append("rect")
      .attr("x", (d) => x(d.value) + 8)
      .attr("y", (d) => y(d.label)! + y.bandwidth() / 2 - 10)
      .attr("width", 50)
      .attr("height", 20)
      .attr("fill", "rgba(0,0,0,0.5)")
      .attr("rx", 4);

    labels
      .append("text")
      .attr("x", (d) => x(d.value) + 15)
      .attr("y", (d) => y(d.label)! + y.bandwidth() / 2)
      .attr("alignment-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", 14)
      .attr("font-weight", 600)
      .text((d) => d.value);
  }, [prevMonth, lastMonth, sameCompanyAverage, otherAverage]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto custom-scrollbar">
      <svg ref={ref} className="drop-shadow-lg min-w-[500px]"></svg>
    </div>
  );
};

export default HorizontalBarChart;

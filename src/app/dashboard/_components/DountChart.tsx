import { useEffect, useRef } from "react";
import * as d3 from "d3";

const DonutChart = ({
  total,
  lastMonth,
}: {
  total: number;
  lastMonth: number;
}) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    const data = [
      { label: "이번 달", value: lastMonth },
      { label: "나머지", value: Math.max(total - lastMonth, 0) },
    ];

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.label))
      .range(["#2f4f4f", "#222A33"]);

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<{ label: string; value: number }>()
      .value((d) => d.value)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    svg
      .selectAll("path")
      .data(pie(data))
      .join("path")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("d", arc as any)
      .attr("fill", (d) => color(d.data.label))
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5);
  }, [total, lastMonth]);

  return <svg ref={ref}></svg>;
};

export default DonutChart;

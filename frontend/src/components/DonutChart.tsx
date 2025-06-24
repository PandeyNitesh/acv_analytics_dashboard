import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ACVItem } from "../redux/chartSlice";

interface Props {
  data: ACVItem[];
  categoryKey: string;
}

export const D3DonutChart: React.FC<Props> = ({ data, categoryKey }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const summary = data.reduce((acc: any, curr) => {
      const key = curr[categoryKey];
      if (!acc[key]) acc[key] = 0;
      acc[key] += curr.acv;
      return acc;
    }, {});

    const chartData = Object.entries(summary).map(([k, v]) => ({
      name: k,
      value: v as number,
    }));

    const total = d3.sum(chartData, (d) => d.value);
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Clear

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(chartData.map((d) => d.name))
      .range(["#1976d2", "#fb8c00"]);

    const pie = d3
      .pie<any>()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc<any>()
      .innerRadius(radius - 70)
      .outerRadius(radius - 10);

    const arcLabel = d3
      .arc<any>()
      .innerRadius(radius - 40)
      .outerRadius(radius);

    const arcs = g
      .selectAll(".arc")
      .data(pie(chartData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      //@ts-ignore
      .attr("fill", (d) => color(d.data.name)!)
      .append("title")
      .text(
        (d) => `${d.data.name}: $${(d.data.value / 1000).toLocaleString()}K`
      );

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arcLabel.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text((d) => `$${(d.data.value / 1000).toLocaleString()}K`);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text(`Total\n$${(total / 1000).toLocaleString()}K`);
  }, [data, categoryKey]);

  return <svg ref={ref}></svg>;
};

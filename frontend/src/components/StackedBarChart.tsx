import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ACVItem } from "../redux/chartSlice";

interface Props {
  data: ACVItem[];
  categoryKey: string;
  showValuesInsideBars?: boolean;
}

export const D3StackedBarChart: React.FC<Props> = ({
  data,
  categoryKey,
  showValuesInsideBars = false,
}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 700;
    const height = 500;
    const margin = { top: 30, right: 30, bottom: 60, left: 80 };

    const grouped = d3.group(data, (d) => d.fiscal_quarter);
    const categories = Array.from(new Set(data.map((d) => d[categoryKey])));
    const quarters = Array.from(grouped.keys());

    const stackedData = quarters.map((q) => {
      const base: any = { quarter: q };
      categories.forEach((cat) => {
        const total =
          grouped
            .get(q)
            ?.filter((d) => d[categoryKey] === cat)
            .reduce((sum, d) => sum + d.acv, 0) || 0;
        base[cat] = total;
      });
      return base;
    });

    const series = d3.stack().keys(categories)(stackedData as any);

    const x = d3
      .scaleBand()
      .domain(quarters)
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(series, (s) => d3.max(s, (d) => d[1]))!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal<string>()
      .domain(categories)
      .range(["#1976d2", "#fb8c00"]);

    svg.attr("width", width).attr("height", height);

    const bars = svg
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", (d) => color(d.key)!);

    bars
      .selectAll("rect")
      .data((d) => d.map((v) => ({ ...v, key: (d as any).key })))
      .join("rect")
      //@ts-ignore
      .attr("x", (d) => x(d.data.quarter)!)
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());

    if (showValuesInsideBars) {
      bars
        .selectAll("text")
        .data((d) => d.map((v) => ({ ...v, key: (d as any).key })))
        .join("text")
        //@ts-ignore
        .attr("x", (d) => x(d.data.quarter)! + x.bandwidth() / 2)
        .attr("y", (d) => y(d[1]) + (y(d[0]) - y(d[1])) / 2 + 5)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "13px")
        .attr("font-weight", "bold")
        .text((d) => {
          const value = d[1] - d[0];
          const percentage =
            (value / categories.reduce((sum, key) => sum + d.data[key], 0)) *
            100;
          return `$${(value / 1000).toLocaleString()}K (${Math.round(
            percentage
          )}%)`;
        });
    }

    stackedData.forEach((d, i) => {
      const total = categories.reduce((sum, key) => sum + d[key], 0);
      svg
        .append("text")
        .attr("x", x(d.quarter)! + x.bandwidth() / 2)
        .attr("y", y(total) - 8)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .text(`$${(total / 1000).toLocaleString()}K`);
    });

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(0,5)")
      .style("text-anchor", "middle");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(y).tickFormat((d) => `$${(+d / 1000).toLocaleString()}K`)
      );
  }, [data, categoryKey, showValuesInsideBars]);

  return <svg ref={ref}></svg>;
};

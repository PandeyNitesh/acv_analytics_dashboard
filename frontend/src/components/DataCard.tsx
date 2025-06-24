import React, { useEffect, useRef } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import * as d3 from "d3";

interface DataItem {
  [key: string]: any;
}

interface Props {
  title: string;
  data: DataItem[];
}

const DataCard: React.FC<Props> = ({ title, data }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !data.length) return;
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 200;
    const key = Object.keys(data[0])[0];
    const valueKey = Object.keys(data[0])[1];

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d[key]))
      .range([0, width])
      .padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[valueKey]) || 0])
      .range([height, 0]);

    svg.attr("width", width).attr("height", height);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d[key])!)
      .attr("y", (d) => y(d[valueKey]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[valueKey]))
      .attr("fill", "steelblue");
  }, [data]);

  return (
    <Card sx={{ marginBottom: 3, width: 340 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <svg ref={ref}></svg>
      </CardContent>
    </Card>
  );
};

export default DataCard;

"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import Image from "next/image";

interface DataPoint {
  name: string;
  value: number;
  logo: string;
}

interface TreemapChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

type HierarchyDatum = {
  children?: DataPoint[];
} & Partial<DataPoint>;

type TreemapNode = d3.HierarchyRectangularNode<HierarchyDatum>;

export default function TreemapChart({
  data,
  width = 800,
  height = 600,
}: TreemapChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Prepare data for treemap
    const root = d3
      .hierarchy<HierarchyDatum>({ children: data } as HierarchyDatum)
      .sum((d) => d.value || 0);

    // Create treemap layout
    const treemap = d3
      .treemap<HierarchyDatum>()
      .size([width, height])
      .padding(12)
      .round(true);

    // Generate the treemap layout
    treemap(root);

    // Create container for each cell
    const cell = svg
      .selectAll<SVGGElement, TreemapNode>("g")
      .data(root.leaves())
      .join("g")
      .attr(
        "transform",
        (d) => `translate(${(d as TreemapNode).x0},${(d as TreemapNode).y0})`
      );

    // Add cell rectangles
    cell
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", (d) => (d as TreemapNode).x1 - (d as TreemapNode).x0)
      .attr("height", (d) => (d as TreemapNode).y1 - (d as TreemapNode).y0)
      .attr("fill", (d, i) => {
        const colors = [
          "rgba(0, 168, 82, 0.04)", // Success green with opacity
          "rgba(0, 122, 255, 0.04)", // Blue with opacity
          "rgba(88, 86, 214, 0.04)", // Indigo with opacity
          "rgba(255, 149, 0, 0.04)", // Orange with opacity
        ];
        return colors[i % colors.length];
      })
      .attr("stroke", (d, i) => {
        const colors = [
          "rgba(0, 168, 82, 0.08)", // Success green border
          "rgba(0, 122, 255, 0.08)", // Blue border
          "rgba(88, 86, 214, 0.08)", // Indigo border
          "rgba(255, 149, 0, 0.08)", // Orange border
        ];
        return colors[i % colors.length];
      })
      .attr("stroke-width", 1);

    // Add foreign object for logo and text
    cell.each(function (d) {
      const cellWidth = (d as TreemapNode).x1 - (d as TreemapNode).x0;
      const cellHeight = (d as TreemapNode).y1 - (d as TreemapNode).y0;
      const g = d3.select(this);

      const fo = g
        .append("foreignObject")
        .attr("width", cellWidth)
        .attr("height", cellHeight);

      const div = fo
        .append("xhtml:div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("text-align", "center")
        .style("padding", "12px");

      // Add logo container with Next.js Image
      const logoContainer = div
        .append("xhtml:div")
        .style("width", "48px")
        .style("height", "48px")
        .style("position", "relative")
        .style("margin-bottom", "8px")
        .style("border-radius", "12px")
        .style("overflow", "hidden")
        .style("box-shadow", "0 1px 2px rgba(0, 0, 0, 0.04)")
        .style("border", "1px solid rgba(0, 0, 0, 0.08)")
        .style("background-color", "white");

      // Add Next.js Image component
      logoContainer
        .append("xhtml:div")
        .style("width", "100%")
        .style("height", "100%")
        .style("position", "relative").html(`
          <img
            src="${d.data.logo || ""}"
            alt="${d.data.name || ""}"
            style="width: 100%; height: 100%; object-fit: contain;"
          />
        `);

      // Add stock name
      div
        .append("xhtml:div")
        .style("font-size", "17px")
        .style("line-height", "22px")
        .style("font-weight", "500")
        .style("color", "#1D1D1F")
        .style("margin-bottom", "4px")
        .text(d.data.name || "");

      // Add percentage with larger font
      div
        .append("xhtml:div")
        .style("font-size", "22px")
        .style("line-height", "28px")
        .style("font-weight", "600")
        .style("color", "#1D1D1F")
        .text(`${d.data.value?.toFixed(1)}%`);
    });

    // Add tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr(
        "class",
        "absolute z-50 pointer-events-none bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg ring-1 ring-black/[0.05] opacity-0 transition-opacity duration-300"
      );

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { feature } from "topojson-client";

export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 800;
  const height = 450;

  useEffect(() => {
      const svg = d3.select(svgRef.current);
      const projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 2]);

      const pathGenerator = d3.geoPath().projection(projection);

      svg.selectAll("*").remove(); // Clear previous contents
      const g = svg.append("g");

      d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then((topology: any) => {
        const geoData: FeatureCollection<Geometry, GeoJsonProperties> = feature(topology, topology.objects.countries) as any;

        g.selectAll(".country")
          .data(geoData.features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", pathGenerator as any)
          .attr("fill", "#69b3a2")
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5);
      });
      
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      svg.call(zoom as any);

      svg.selectAll(".country")
        .on("mouseover", function() {
          d3.select(this).attr("fill", "#ffcc00");
        })
        .on("mouseout", function() {
          d3.select(this).attr("fill", "#69b3a2");
        });
  }, []);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet"></svg>
  );
    };

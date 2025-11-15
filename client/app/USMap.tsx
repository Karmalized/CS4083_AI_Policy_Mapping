import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

const USMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 960;
  const height = 600;

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous render

    // Projection
    const projection = d3.geoAlbersUsa()
      .scale(1280)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Load TopoJSON
    d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
      .then((us: any) => {
        const states = topojson.feature(
          us,
          us.objects.states
        ) as FeatureCollection<Geometry, GeoJsonProperties>;

        svg.append("g")
          .attr("class", "states")
          .selectAll("path")
          .data(states.features)
          .enter()
          .append("path")
          .attr("d", d => path(d)!)
          .attr("fill", "lightgray")
          .attr("stroke", "white");
      });
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default USMap;

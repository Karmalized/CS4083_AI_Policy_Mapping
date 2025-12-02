import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { feature } from "topojson-client";

export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 800;
  const height = 450;
  const [policyData, setPolicyData] = React.useState<any[]>([]);
  const [countryCodes, setCountryCodes] = React.useState<{[key: string]: number}>({});

  useEffect(() => {
      async function dataConnect(){
        const policyMapResponse = await fetch("http://127.0.0.1:8000/policy/internationalcallCountryMapping");
        const policyMapData = await policyMapResponse.json();
        console.log(policyMapData);
        setPolicyData(policyMapData);

        const countryCodesResponse = await fetch("http://127.0.0.1:8000/policy/international/countryCodes");
        const countryCodesData = await countryCodesResponse.json();
        console.log(countryCodesData);
        setCountryCodes(countryCodesData);
      }

      dataConnect();
  }, []);

  React.useEffect(() => {
    const svg = d3.select(svgRef.current);
      const projection = d3.geoMercator()
        .scale(130)
        .translate([width / 2, height / 2]);

      const pathGenerator = d3.geoPath().projection(projection);

      svg.selectAll("*").remove(); // Clear previous contents
      const g = svg.append("g");

      d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then((topology: any) => {
        const geoData: FeatureCollection<Geometry, GeoJsonProperties> = feature(topology, topology.objects.countries) as any;
        console.log(geoData);
        geoData.features.forEach((d) => {
          const countryID = d.id ? d.id.toString() : null;
          const countryName = countryCodes[countryID || ''];
          const OECD = policyData[countryName] || 0;
          console.log(OECD.policyCount)
          d.properties = {
            ...d.properties,
            policyCount: OECD.policyCount,
          };
        });
      
        const Count = d3.max(geoData.features, d => d.properties?.policyCount || 0) || 1;
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
          .domain([0, Count]);

        g.selectAll(".country")
          .data(geoData.features)
          .enter()
          .append("path")
          .attr("class", "country")
          .attr("d", pathGenerator as any)
          .attr("fill", d => { {
            const count = d.properties?.policyCount || 0;
            return colorScale(count);
          } })
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.5)
          .on("mouseover", function(event, d) {
            const toolWidth = 150;
            const toolHeight = 50;
            const screenWidth = svgRef.current?.getBoundingClientRect().width || 0;
            const screenHeight = svgRef.current?.getBoundingClientRect().height || 0;

            let [x, y] = d3.pointer(event);
            if (x + toolWidth > screenWidth) {
              x = screenWidth - toolWidth - 10;
            }
            if (y + toolHeight > screenHeight) {
              y = screenHeight - toolHeight - 10;
            }

            d3.select(this).attr("fill", "#ffcc00");

            d3.select("#tool")
              .style("left", x + "px")
              .style("top", y + "px")
              .style("display", "block")
              .html(`<strong>Country:</strong> ${d.properties?.name || null}
                <h3>Policies: ${d.properties?.policyCount || 0}</h3>
                `);
          })
          .on("mouseout", function() {
            d3.select(this).attr("fill", (d: any) => {
              const count = d.properties?.policyCount || 0;
              return colorScale(count);
            });
            d3.select("#tool").style("display", "none");
          });
      });
      
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .translateExtent([[0, 0], [width, height]])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });

      svg.call(zoom as any);


  }, [policyData, countryCodes]);

  return (
    <>
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet"></svg>
    <div id="tool" style={{
      position: 'absolute',
      background: 'white',
      padding: '4px',
      border: '1px solid black',
      pointerEvents: 'none',
      display: 'none',
    }}></div>
    </>
  );
    };

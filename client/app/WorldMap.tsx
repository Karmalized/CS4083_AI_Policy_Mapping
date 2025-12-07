import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { feature } from "topojson-client";
import CountryAnalyticsPanel from "./CountryAnalyticsPanel";
import { StyleSheet, Platform } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ImageBackground } from "expo-image";


// MAP VIEW FOR POLICY DATA
export default function WorldMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 800;
  const height = 450;
  const [policyData, setPolicyData] = React.useState<{[key: string]: countryPolicy}>({});
  const [countryCodes, setCountryCodes] = React.useState<{[key: string]: number}>({});
  const [selectedCountryName, setSelectedCountryName] = React.useState<string>("");
  const [selectedCountryData, setSelectedCountryData] = React.useState<Policy[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = React.useState<string>("");

  // Styles for the map container
  const color = "rgba(44, 35, 126, 0.16)"
  const styles = StyleSheet.create({
      container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backgroundColor: Platform.OS === 'web' ? '#2c237e28' : 'transparent',
      }
  });
  
  // Fetch Policy Data and Country Codes on Component Mount
  useEffect(() => {
      async function dataConnect(){
        const policyMapResponse = await fetch("http://127.0.0.1:8000/policy/international/callCountryMapping");
        const policyMapData = await policyMapResponse.json();
        setPolicyData(policyMapData);

        const countryCodesResponse = await fetch("http://127.0.0.1:8000/policy/international/countryCodes");
        const countryCodesData = await countryCodesResponse.json();
        setCountryCodes(countryCodesData);
      }

      dataConnect();
  }, []);

  React.useEffect(() => {   // Effect to render map when policyData or countryCodes change
    const svg = d3.select(svgRef.current); // Select SVG element

      // Define Projection and Path Generator
      const projection = d3.geoMercator()
        .scale(130) // Scale for zoom level
        .translate([width / 2, height / 2]); // Translate to center

      const pathGenerator = d3.geoPath().projection(projection); // Path Generator

      svg.selectAll("*").remove(); // Clear previous contents
      


      const g = svg.append("g"); // Group for map elements

      // Load and Process GeoJSON Data
      d3.json("https://unpkg.com/world-atlas@2.0.2/countries-110m.json").then((topology: any) => {
        const geoData: FeatureCollection<Geometry, GeoJsonProperties> = feature(topology, topology.objects.countries) as any;
        //console.log(geoData); // Log GeoData for debugging

        geoData.features.forEach((d) => { // For each country feature
          const countryID = d.id ? d.id.toString() : null; // Get country code
          const countryName = countryCodes[countryID || '']; // Get country name from country code mapping
          const OECD = policyData[countryName] || 0; // Get policy data for country

          d.properties = { // Add properties to each country feature
            ...d.properties, // Retain existing properties
            OECD_ID: OECD.id || 0, // Add OECD ID property
            policyCount: OECD.policyCount, // Add policy count property
          };
        });
      
        const Count = d3.max(geoData.features, d => d.properties?.policyCount || 0) || 1; // Max Policy Count
        
        // Color Scale of Countries based on Policy Count
        const colorScale = d3.scaleLinear<string>()
          .domain([0, Count *0.03, Count])
          .range(["#497094ff", "#1b3463ff", "#001133"]);


        g.selectAll(".country") // Select all country paths
          .data(geoData.features)   // Bind data to countries
          .enter() // Enter selection for countries
          .append("path") // Append path for each country
          .attr("class", "country") // Country class for styling
          .attr("d", pathGenerator as any) // Path Generator
          .attr("fill", d => { { // Fill Color
            const count = d.properties?.policyCount || 0; // Get policy count
            return colorScale(count); // Fill Color based on policy count
          } })
          .attr("stroke", "#d3b20eff") // Stroke Color for country borders
          .attr("filter", "drop-shadow(0 0 12px #00eaff) brightness(1.0)") // Stroke Width
          .on("mouseover", function(event, d) { // Mouseover Event
            const toolWidth = 150; // Approximate width of tooltip
            const toolHeight = 50; // Approximate height of tooltip
            const screenWidth = svgRef.current?.getBoundingClientRect().width || 0; // Get SVG width
            const screenHeight = svgRef.current?.getBoundingClientRect().height || 0; // Get SVG height

            let [x, y] = d3.pointer(event); // Get mouse position relative to SVG
            if (x + toolWidth > screenWidth) { // Adjust if tooltip goes beyond screen
              x = screenWidth - toolWidth - 10;
            }
            if (y + toolHeight > screenHeight) { // Adjust if tooltip goes beyond screen
              y = screenHeight - toolHeight - 10;
            }
            // Highlight Country
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
          })
          .on("click", function(event, d){
            const countryID = d.properties?.OECD_ID;
            const countryName = d.properties?.name as string;
            const countryCode = d.id as string;
            generateCountryAnalytics(countryCode, countryName, countryID)
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

  async function generateCountryAnalytics(Code: string, Name: string, ID: number){
    const response = await fetch(`http://127.0.0.1:8000/policy/international/countryPolicies/${ID}`)
    const data = await response.json()
    setSelectedCountryName(Name)
    setSelectedCountryCode(Code)
    setSelectedCountryData(data)
  }

  interface Principle {
    id: number,
    name: string,
    type: string,
    order: number,
    deletedAt?: string
  }

  interface Country {
    id: number,
    name: string,
    code: string,
    language: string,
    incomeGroup?: string,
    populationIn2023?: number,
    gdp?: number
  }

  interface Sector {
    id: number,
    name: string,
    description?: string,
    order?: number
  }

  interface Policy {
    id: number,
    englishName: string,
    description?: string,
    website?: string,
    responsibleOrganization?: string,
    startYear?: number,
    endYear?: number,
    gaiinCountry: Country,
    targetSectors?: Sector[]
    principles?: Principle[]
  }

  interface countryPolicy {
    id: number,
    code: string,
    policyCount: number
  }
  

  return (
    <>
    <ThemedView style={styles.container}>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet"></svg>
      <div id="tool" style={{
        position: 'absolute',
        background: 'white',
        padding: '4px',
        border: '1px solid black',
        pointerEvents: 'none',
        display: 'none',
      }}></div>
    </ThemedView>
    {selectedCountryData && (
      <CountryAnalyticsPanel code={selectedCountryCode} name={selectedCountryName} data={selectedCountryData}/>
    )}
    </>
  );
    };

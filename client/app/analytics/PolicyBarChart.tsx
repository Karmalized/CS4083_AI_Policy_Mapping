import React from 'react'
import * as d3 from 'd3'
import { useRef } from 'react'
import { Platform } from 'react-native'
import { StyleSheet } from 'react-native'
import { ThemedText } from '@/components/themed-text'

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

  interface PolicyBarChartProps {
    policies: Policy[]
  }

export default function PolicyBarChart({policies}: PolicyBarChartProps) {

    const [targetSector, setTargetSector] = React.useState<string[]>([]);
    const sectorCounts: Record<string,number> = {}
    const svgRef = useRef<SVGSVGElement | null>(null);

    const styles = StyleSheet.create({
          texture: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
      });

    React.useEffect(() => {
          policies.forEach(policy => {policy.targetSectors?.forEach(sector => {sectorCounts[sector.name] = (sectorCounts[sector.name] || 0) + 1})})
          console.log(sectorCounts)

            const margins = { top: 20, right: 30, bottom: 65, left: 50 };
            const width = 600 - margins.left - margins.right;
            const height = 400 - margins.top - margins.bottom;

            d3.select(svgRef.current).selectAll("g").remove()


            const svg = d3.select(svgRef.current)
            .attr("width", width + margins.left + margins.right)
            .attr("height", height + margins.top + margins.bottom);

            const chartGroup = svg.append("g")
            .attr("transform", `translate(${margins.left},${margins.top})`);

          const chartData = Object.entries(sectorCounts).map(([sector,count]) => ({
            sector,
            count
          }))

          const xScale = d3.scaleBand<string>().domain(chartData.map(d => d.sector)).range([0,width]).padding(0.5);
          
          const yScale = d3.scaleLinear<number>().domain([0, d3.max(chartData, d => d.count)!]).range([height,0])

          const color = d3.scaleOrdinal<string>().domain(chartData.map(d => d.sector)).range(d3.schemeCategory10)
          // Draw rectangles
          chartGroup.selectAll("rect")
          .data(chartData)
          .join("rect")
          .attr("x", d => xScale(d.sector)!)
          .attr("y", height)
          .attr("width", xScale.bandwidth)
          .attr("height", 0)
          .attr("fill", (d) => color(d.sector))
          .transition()
          .duration(1000)
          .attr("y", d => yScale(d.count))
          .attr("height", d => height - yScale(d.count))
          .text(d => d.count)

          chartGroup.selectAll("text")
          .data(chartData)
          .join("text")
          .attr("x", d => xScale(d.sector)! + xScale.bandwidth()/2)
          .attr("y", d => yScale(d.count) - 5)
          .attr("text-anchor", "middle")
          .attr("fill", `${Platform.OS === 'web' ? '#000' : 'transparent'}`)
          .attr("font-size", "10px")
          .attr("stroke","currentColor")
          .text(d => d.count);


          chartGroup.append("g")
          .attr("transform", `translate(0,${height})`)
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("font-size", "5.5px")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")
          

          chartGroup.append("g")
          .call(d3.axisLeft(yScale))

          // Add X axis label
        chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margins.bottom - 5)
        .attr("stroke","currentColor")
        .text("Social Sectors");

// Add Y axis label
        chartGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margins.left + 15)
        .attr("stroke","currentColor")
        .text(" AI Policy Proposal Count");
          
      }, [policies]);

  return (
    <>
    <ThemedText><h3 style={styles.texture}>AI Initiative Target Sectors by Frequency</h3></ThemedText>
    <ThemedText><svg ref={svgRef} style={{backgroundColor: Platform.OS === 'web' ? '#2c237e28' : 'transparent'}}></svg></ThemedText>
    </>
  )
}

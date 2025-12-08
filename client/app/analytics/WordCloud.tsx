import React from 'react'
import * as d3 from "d3";
import cloud from 'd3-cloud';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Platform } from 'react-native';

interface Principle {
    id: number,
    name: string,
    type: string,
    order: number
  }

  interface Tag {
    id: number,
    name: string,
    order: number
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
    tags?: Tag[]
  }

interface WorldCloudProps {
    data: Policy[]
}

export default function WordCloud({data}: WorldCloudProps) {

    const width = 800
    const height = 600
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const tagData = Array.from(
          d3.rollup(
            data.flatMap(p => p.tags ?? []),
            v => v.length,
            pr => pr.name
          ),
          ([tag, count]) => ({ tag, count })
        );  

        const sizeScale = d3.scaleLinear().domain([0, d3.max(tagData, d => d.count)!])
        .range([10, 60]);

        console.log(tagData)
    
    const layout = cloud()
    .size([width,height])
    .words(tagData.map(d => ({text: d.tag, size: d.count})))
    .padding(2)
    .rotate(() => ~~(Math.random() * 2) * 90)
    .font("Impact")
    .fontSize(d => sizeScale(d.size!))
        .on("end", words => {
            d3.select(containerRef.current).select("svg").remove();

            const svg = d3.select(containerRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            
        svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => d.size + "px")
        .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text!);
        }
        );

    layout.start()

    },[data])

  return (
    <div>
    <ThemedText style={{textAlign: 'center'}}><h3>AI Policy Keyword Cloud</h3></ThemedText>
    <ThemedView style={{backgroundColor: Platform.OS === 'web' ? '#2c237e28' : 'transparent'}}>
        <div ref={containerRef}/>
    </ThemedView>
    </div>
  )
}

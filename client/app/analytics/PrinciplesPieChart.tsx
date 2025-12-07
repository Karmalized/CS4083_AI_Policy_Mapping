import { ThemedText } from '@/components/themed-text'
import React from 'react'
import { StyleSheet } from 'react-native'
import * as d3 from 'd3';
import { Platform } from 'react-native';
import { Collapsible } from '@/components/ui/collapsible';
import { ThemedView } from '@/components/themed-view';

interface Principle {
    id: number,
    name: string,
    type: string,
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
  }

  interface PrinciplesTreemapProps {
    policies: Policy[]
  }

  const styles = StyleSheet.create({
            texture: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            },
            view: {
            alignItems: 'center',
            padding: 16,
            width: '100%',
            backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : 'transparent',
            }
        });

export default function PrinciplesTreemap({ policies }: PrinciplesTreemapProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);

  const [mapChartData, setChartData] = React.useState<{principle: string, count: number}[]>([]);

  React.useEffect(() => {
    const margins = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = 600 - margins.left - margins.right;
    const height = 600 - margins.top - margins.bottom;

    // Build principle counts
    const chartData = Array.from(
      d3.rollup(
        policies.flatMap(p => p.principles ?? []),
        v => v.length,
        pr => pr.name
      ),
      ([principle, count]) => ({ principle, count })
    );

    setChartData(chartData)

    const color = d3.scaleOrdinal(chartData.map(d => d.principle), d3.schemeTableau10)

    console.log(chartData);

    // Build hierarchy from chartData
    const root = d3.treemap<{principle: string, count: number}>()
    .tile(d3.treemapSquarify)
    .size([width,height]).padding(1)(d3.hierarchy<{principle: string, count: number}>({children: chartData}).sum(d => d.count))

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous render

    svg
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("rect")
      .data(root.leaves())
      .enter()
      .append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill",d => color(d.data.principle))
      .on("mouseover", function(event, d) { // Mouseover Event
                        // Highlight Country
                        d3.select(this).attr("fill", "#ffcc00");
                        svg.selectAll("text")
                        .filter(t => t === d)
                        .text(`Count: ${d.data.count}`)

      })
      .on("mouseout", function(event, d) {
        const label = `${d.data.principle}`;
        const maxChars = Math.floor((d.x1 - d.x0) / 7); // rough width estimate
        d3.select(this).attr("fill", (d: any) => {
        const name = d.data.principle || 0;
            return color(name);
        });
        svg.selectAll("text")
        .filter(t => t === d)
        .text(label.length > maxChars ? label.slice(0, maxChars) + "…" : label)
    });

    svg.selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", d => d.x0 + 3)
      .attr("y", d => d.y0 + 12)
      .text(d => {
        const label = `${d.data.principle}`;
        const maxChars = Math.floor((d.x1 - d.x0) / 7); // rough width estimate
        return label.length > maxChars ? label.slice(0, maxChars) + "…" : label;
  })
  .attr("font-size", "12px")
  .attr("fill", "currentColor");
  }, [policies]);

  return (
    <>
    <div style={styles.texture}>
        <ThemedText style={{textAlign: 'center'}}>
            <h3>Principles Frequency Charting</h3>
            <h4>Which OECD AI Principles are prioritized most?</h4>
        </ThemedText>
        <ThemedText>
            <svg ref={svgRef} style={{backgroundColor: Platform.OS === 'web' ? '#2c237e28' : 'transparent'}}></svg>
            <div id="tooltip" style={{
            position: 'absolute',
            background: 'white',
            padding: '4px',
            border: '1px solid black',
            pointerEvents: 'none',
            display: 'none',
            zIndex: 10
        }}></div>
        </ThemedText>
        <ThemedView style={styles.view}>
            <Collapsible title="Principles Shorthand">
                {mapChartData.map(item => (
                    <ThemedText>
                        {item.principle}
                    </ThemedText>
                ))}
            </Collapsible>
        </ThemedView>
    </div>
    </>
  )
}

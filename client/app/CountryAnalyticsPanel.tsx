import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Flag from 'react-world-flags';
import { ThemedText } from '@/components/themed-text';
import { symbol } from 'd3';
import PolicyBarChart from './analytics/PolicyBarChart';
import PrinciplesPieChart from './analytics/PrinciplesPieChart';
import WordCloud from './analytics/WordCloud';

interface countryIdentityProps {
        code: string;
        name: string;
        data: Policy[];
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

    const styles = StyleSheet.create({
          container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingTop: 8
          },
      });

export default function CountryAnalyticsPanel({code, name, data}: countryIdentityProps) {

    console.log(data);

  return (
    <div className="analytics-panel">
        {name && 
        <>
        <div style={styles.container}>
            <ThemedText ><h2>{name}</h2></ThemedText>
            <Flag height={50} width={50} code={code as string}/>
        </div>
        { data.length >= 1 &&
        <>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 100}}>
            <PolicyBarChart policies={data}/>
            <PrinciplesPieChart policies={data} /> 
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 100}}>
            <WordCloud data={data}/>
            <div>
            <ThemedText style={{textAlign: 'center'}}><h3>AI Initiative Listings</h3></ThemedText> 
            <div style={{
                maxHeight: '400px',
                overflow: 'auto',
                padding: '1opx',
                borderRadius: '6px'
            }}>
            {data.map(policy => 
                <div key={policy.id} style={{marginBottom: "12px"}}>
                    <ThemedText>
                    <h4 style={{margin: 0}}><a href={policy.website} target='_blank' rel='noopener nonreferrer'>{policy.englishName}</a></h4>
                    <p style={{margin: "4px 0"}}>{policy.description}</p>
                    <small>Start Year: {policy.startYear}</small>
                    </ThemedText>
                </div>
            )}
            </div>
            </div>
        </div>
        </>
        }
        </>
        }
    </div>
  )
}

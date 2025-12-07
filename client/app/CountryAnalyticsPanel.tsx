import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import Flag from 'react-world-flags';
import { ThemedText } from '@/components/themed-text';
import { symbol } from 'd3';
import PolicyBarChart from './analytics/PolicyBarChart';
import PrinciplesPieChart from './analytics/PrinciplesPieChart';

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
        </>
        }
        </>
        }
    </div>
  )
}

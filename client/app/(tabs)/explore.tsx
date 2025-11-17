import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import USMap from '../USMap';
import axios from 'axios';
import React from 'react';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {

  const [houseBillsData, setHouseBillsData] = React.useState([]);
  const [senateBillsData, setSenateBillsData] = React.useState([]);

  React.useEffect(() => {
  async function loadStreamedBills() {
    const response = await fetch("http://127.0.0.1:8000/stream-ai-house-bills?congress=119");
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        if (line.trim()) {
          const bill = JSON.parse(line);
          setHouseBillsData(prev => [...prev, bill]);
        }
      }
    }
  }
  loadStreamedBills();
}, []);


  return (
    <ParallaxScrollView
      headerBackgroundColor={{dark: '#000', light: '#333'}}
      headerImage={
        <Image
          source={require('../../assets/images/ai-technology-artificial-intelligence.jpg')}
          style={styles.headerImage}
          contentFit="cover"
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>US AI Legislation Map</ThemedText>
        <USMap />
        <Collapsible title="About This Map">
          <ThemedText style={styles.paragraph}>
            This map visualizes the current state of AI legislation across the United States. Each state is color-coded based on the number and type of AI-related bills that have been proposed or enacted.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            Use this tool to explore how different states are approaching AI regulation, identify trends, and understand the legislative landscape surrounding artificial intelligence.
          </ThemedText>
          <ExternalLink href="https://app.slack.com/client/T06BVEHCLG0/dms"></ExternalLink>
        </Collapsible>
      </ThemedView>

      {<ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Recent AI-Related Bills in Congress</ThemedText>
        <Collapsible title="House Bills">
          {houseBillsData.map((bill: any, index: number) => (
            <ThemedText key={index} style={styles.paragraph}>
              {bill.title} - <ExternalLink href={bill.url}>View Bill</ExternalLink>
            </ThemedText>
          ))}
        </Collapsible>
        <Collapsible title="Senate Bills">
          {senateBillsData.map((bill: any, index: number) => (
            <ThemedText key={index} style={styles.paragraph}>
              {bill.title} - <ExternalLink href={bill.url}>View Bill</ExternalLink>
            </ThemedText>
          ))}
        </Collapsible>
      </ThemedView>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    padding: 16,
    backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : 'transparent',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.sans,
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  collapsible: {
    marginTop: 24,
  },
})


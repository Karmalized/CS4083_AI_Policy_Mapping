import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import USMap from '../USMap';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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


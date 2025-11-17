import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{dark: '#000', light: '#333'}}
      headerImage={
        <Image
          source={require('../../assets/images/ai-robot-handshake-human.jpg')}
          style={styles.headerImage}
          contentFit="cover"
        />
      }>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title}>Welcome to the AI Policy Mapper</ThemedText>
        <HelloWave />
        <ThemedText style={styles.paragraph}>
          Explore the legislative landscape of artificial intelligence across the United States. Use the tabs above to navigate through different sections of the app.
        </ThemedText>
        <Link href="/explore" style={styles.link}>
          Go to Explore Tab
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
 
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
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
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    paragraph: {
      fontSize: 16,
      marginBottom: 12,
      lineHeight: 22,
    },
    link: {
      fontSize: 18,
      color: '#1e90ff',
      textAlign: 'center',
      marginTop: 20,
    },
  });


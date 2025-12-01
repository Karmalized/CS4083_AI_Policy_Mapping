import { StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import WorldMap from '../WorldMap';
import { Image } from 'expo-image';
import ParallaxScrollView from '@/components/parallax-scroll-view';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: Platform.OS === 'web' ? '#f0f0f0' : 'transparent',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
});


export default function TabThreeScreen() {

  return (
    <ParallaxScrollView 
    headerBackgroundColor={{dark: '#000', light: '#333'}} 
    headerImage={<Image
      source={require('../../assets/images/world_ai.jpg')}
      style={styles.headerImage}
      contentFit="cover"
    />
    }>
      <ThemedText style={{fontSize: 24, fontFamily: 'System', marginBottom: 16, textAlign: 'center'}}>International AI Policy Map</ThemedText>
      <ThemedView style={styles.container}>
        <WorldMap />
      </ThemedView>
    </ParallaxScrollView>
  );
}
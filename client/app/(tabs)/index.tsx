import { Image } from 'expo-image';
import { Linking, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { View } from 'react-native';

interface HubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  followers: number;
  public_repos: number;
}

export default function HomeScreen() {
  const [profile, setProfile] = React.useState<HubProfile | null>(null);

  React.useEffect(() => {
    // Simulate fetching user profile data
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Karmalized');
        const data = await response.json();
        console.log(data);
        const fetchedProfile: HubProfile = {
          login: data.login,
          avatar_url: data.avatar_url,
          html_url: data.html_url,
          name: data.name,
          bio: data.bio,
          followers: data.followers,
          public_repos: data.public_repos,
        };
      setProfile(fetchedProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
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

        <ThemedView style={styles.invertContainer}>
          <ThemedText style={styles.invertTitle}>What is Artificial Intelligence</ThemedText>
          <ThemedText style={styles.invertParagraph}>
            Artificial Intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn. AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.
          </ThemedText>
          <ThemedText style={styles.invertParagraph}>
            The development and deployment of AI technologies have significant implications for various sectors, including healthcare, finance, transportation, and more. As AI continues to evolve, it is crucial to establish policies and regulations that ensure its ethical and responsible use.
          </ThemedText>
          <Image
            source={require('../../assets/images/Define_AI.jpg')}
            style={{ width: '100%', height: 300, marginTop: 16 }}
            contentFit="contain"

          />
        </ThemedView>

        <ThemedView>
          <ThemedText style={styles.title}>About the AI Policy Mapper</ThemedText>
          <ThemedText style={styles.paragraph}>
            The AI Policy Mapper is a tool designed to help users understand the current state of AI legislation in the United States. By compiling AI-related bills and policies, we aim to provide insights into how different states and nations are approaching AI regulation.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            This project is being developed as a passion project to AI legislation and policy. The importance of transparency and accessibility is paramount when it comes to understanding the impact of AI on society.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>Our Development Team</ThemedText>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 12}}>
            <ThemedText style={styles.title}>Contributors:</ThemedText>
            <TouchableOpacity onPress={() => {Linking.openURL(profile.html_url)}}>
              <Image
              source={{ uri: profile.avatar_url }}
              style={{ width: 50, height: 50, borderRadius: 50, marginBottom: 16, borderColor: '#000', borderWidth: 2 }}
              contentFit="cover"
              
            />
          </TouchableOpacity>
          </View>
        </ThemedView>

        <ThemedView>
          <ThemedText style={styles.title}>Resources</ThemedText>
          <ThemedText style={styles.paragraph}>
            For more information on AI policies and legislation, visit the following resources:
          </ThemedText>
          <TouchableOpacity onPress={() => {Linking.openURL('https://www.oecd.ai/')}}>
            <ThemedText style={styles.link}>OECD AI Policy Observatory</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.openURL('https://iapp.org/resources/article/us-state-ai-governance-legislation-tracker/https://ai.gov/')}}>
            <ThemedText style={styles.link}>IAPP US State Governance Legislation Tracker</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.openURL('https://www.caidp.org/')}}>
            <ThemedText style={styles.link}>Center for AI and Digital Policy</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {Linking.openURL('https://www.congress.gov/')}}>
            <ThemedText style={styles.link}>Congress.gov Official Website</ThemedText>
          </TouchableOpacity>
        </ThemedView>

      </ParallaxScrollView>
      <View style={styles.footer}>
        <ThemedText>
          © 2024 AI Policy Mapper. All rights reserved.
        </ThemedText>
      </View>
    </View>
  );
 
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 16,
      width: '100%',
      backgroundColor: Platform.OS === 'web' ? '#333333' : 'transparent',
    },
    invertContainer: {
      alignItems: 'center',
      padding: 16,
      width: '100%',
      backgroundColor: Platform.OS === 'web' ? '#333333' : 'transparent',
    },
    invertTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
      color: '#ffffff',
    },
    invertParagraph: {
      fontSize: 16,
      marginBottom: 12,
      lineHeight: 22,
      textAlign: 'center',
      flexWrap: 'wrap',
      color: '#ffffff',
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
      textAlign: 'center',
      flexWrap: 'wrap',
    },
    link: {
      fontSize: 18,
      color: '#1e90ff',
      textAlign: 'center',
      marginTop: 20,
    },
    footer: {
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


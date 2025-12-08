import React from 'react'
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Linking } from 'react-native';

interface HubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  followers: number;
  public_repos: number;
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      padding: 16,
      width: '100%',
      backgroundColor: Platform.OS === 'web' ? '#333333' : 'transparent',
    }
  });

  interface username {
    user: string
  }

export default function GithubProfile({user}: username) {

    const [profile, setProfile] = React.useState<HubProfile | null>(null);

    React.useEffect(() => {
        // Simulate fetching user profile data
        const fetchProfile = async () => {
          try {
            const response = await fetch(`https://api.github.com/users/${user}`);
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
    <>
        <TouchableOpacity onPress={() => {Linking.openURL(profile.html_url)}}>
            <Image
                source={{ uri: profile.avatar_url }}
                style={{ width: 50, height: 50, borderRadius: 50, marginBottom: 16, borderColor: '#000', borderWidth: 2 }}
                contentFit="cover"
            />
        </TouchableOpacity>
    </>
  )
}

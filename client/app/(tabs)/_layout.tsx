import { Tabs, withLayoutContext } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import TabTwoScreen from './explore';
import HomeScreen from '.';
import { TouchableOpacity } from 'react-native';
import TabThreeScreen from './world';

const TopTab = createNativeStackNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <TopTab.Navigator>
      <TopTab.Screen
        name="index"
        component={HomeScreen}
        options={({navigation}) => ({
          headerTitle: 'AI Policy Mapper',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'dark'].background,
          },
          headerLeft: () => (<TouchableOpacity onPress={() => navigation.navigate('index')} style={{marginLeft: 15}}>
            <IconSymbol name="house.fill" size={28} color={Colors[colorScheme ?? 'dark'].text} />
          </TouchableOpacity>),
          headerRight: () => (
            <>
          <TouchableOpacity onPress={() => navigation.navigate('explore')} style={{marginRight: 15}}>
            <IconSymbol name="magnifyingglass" size={28} color={Colors[colorScheme ?? 'dark'].text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('world')} style={{marginRight: 15}}>
            <IconSymbol name="globe.americas" size={28} color={Colors[colorScheme ?? 'dark'].text} />
          </TouchableOpacity>
          </>),
        })}
      />
      <TopTab.Screen
        name="explore"
        component={TabTwoScreen}
        options={({navigation}) => ({
          headerTitle: 'Explore AI Bills',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'dark'].background,
          },
          headerLeft: () => (<TouchableOpacity onPress={() => navigation.navigate('index')} style={{marginLeft: 15}}>
            <IconSymbol name="arrow.left" size={28} color={Colors[colorScheme ?? 'dark'].text} />
          </TouchableOpacity>)
        })}
      />
      <TopTab.Screen
        name="world"
        component={TabThreeScreen}
        options={({navigation}) => ({
          headerTitle: 'International AI Policies',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'dark'].background,
          },
          headerLeft: () => (<TouchableOpacity onPress={() => navigation.navigate('index')} style={{marginLeft: 15}}>
            <IconSymbol name="arrow.left" size={28} color={Colors[colorScheme ?? 'dark'].text} />
          </TouchableOpacity>)
        })}
      />
    </TopTab.Navigator>
  );
}

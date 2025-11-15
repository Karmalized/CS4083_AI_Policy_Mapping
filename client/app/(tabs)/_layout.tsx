import { Tabs, withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TopTab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(TopTab.Navigator);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <TopTabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarIndicatorStyle: { backgroundColor: Colors[colorScheme ?? 'light'].tint },
        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
        tabBarPressColor: Colors[colorScheme ?? 'light'].tint + '33',
        tabBarShowIcon: true,
      }}>
      <TopTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: {color: string}) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <TopTabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }: {color: string}) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </TopTabs>
  );
}

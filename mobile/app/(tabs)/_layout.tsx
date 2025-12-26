// app/(tabs)/_layout.tsx

import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { useThemeColor } from '@/src/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { StyleSheet, View } from 'react-native';

/* --------------------------------------------------
   TYPES
-------------------------------------------------- */

// All valid Ionicons names
type IoniconName = keyof typeof Ionicons.glyphMap;

// Tab configuration type
type TabItem = {
  name: string;
  label: string;
  icon: IoniconName;
  iconActive: IoniconName;
};

/* --------------------------------------------------
   TABS CONFIG
-------------------------------------------------- */

const tabs: TabItem[] = [
  {
    name: 'index',
    label: 'Home',
    icon: 'home-outline',
    iconActive: 'home',
  },
  {
    name: 'explore',
    label: 'Explore',
    icon: 'compass-outline',
    iconActive: 'compass',
  },
  {
    name: 'map',
    label: 'Map',
    icon: 'map-outline',
    iconActive: 'map',
  },
  {
    name: 'chat',
    label: 'Chat',
    icon: 'chatbubble-outline',
    iconActive: 'chatbubble',
  },
  {
    name: 'blog',
    label: 'Blog',
    icon: 'newspaper-outline',
    iconActive: 'newspaper',
  },
];

/* --------------------------------------------------
   COMPONENT
-------------------------------------------------- */

export default function TabLayout() {
  const tint = useThemeColor({}, 'tint');
  const bg = useThemeColor({}, 'tabBarBackground');
  const inactive = useThemeColor({}, 'tabBarInactiveTint');
  const { isAuthenticated, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a spinner
  }

  if (!isAuthenticated && !isGuest) {
    // Use router to redirect since Redirect component is missing
    setTimeout(() => router.replace('/(auth)/login'), 0);
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,

        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: inactive,

        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: bg,
          },
        ],

        tabBarLabelStyle: styles.label,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.iconWrapper,
                  focused && { backgroundColor: `${tint}20` },
                ]}
              >
                <Ionicons
                  name={focused ? tab.iconActive : tab.icon}
                  size={22}
                  color={color}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

/* --------------------------------------------------
   STYLES
-------------------------------------------------- */

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    //bottom: 16,


    height: 70,
    //borderRadius: 24,

    paddingBottom: 8,
    paddingTop: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    elevation: 20,
    borderTopWidth: 0,
  },

  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

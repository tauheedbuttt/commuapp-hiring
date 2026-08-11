import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { colors } from '../theme/colors';
import type { MainTabParamList } from '../types';
import { styles } from './MainTabNavigator.styles';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Settings: 'settings',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.primaryGreen,
        tabBarIcon: ({ focused, color, size }) =>
          focused ? (
            <View style={styles.activeIcon}>
              <Ionicons name={TAB_ICONS[route.name]} size={size} color={colors.white} />
            </View>
          ) : (
            <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
          ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

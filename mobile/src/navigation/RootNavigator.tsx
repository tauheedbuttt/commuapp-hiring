import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useHasHydrated } from '../hooks/useHasHydrated';
import { useDistanceStore } from '../store/distanceStore';
import { useLocationStore } from '../store/locationStore';
import { MainTabNavigator } from './MainTabNavigator';
import { NoticeDetailScreen } from '../screens/NoticeDetail/NoticeDetailScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { colors } from '../theme/colors';
import { styles } from './RootNavigator.styles';
import type { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasLocationHydrated = useHasHydrated(useLocationStore);
  const hasDistanceHydrated = useHasHydrated(useDistanceStore);
  const hasSavedLocation = useLocationStore((state) => state.location !== null);

  if (!hasLocationHydrated || !hasDistanceHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primaryGreen} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={hasSavedLocation ? 'MainTabs' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="NoticeDetail" component={NoticeDetailScreen} />
    </Stack.Navigator>
  );
}

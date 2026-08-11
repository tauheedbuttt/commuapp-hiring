import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { useLocationHasHydrated } from '../hooks/useLocationHasHydrated';
import { useLocationStore } from '../store/locationStore';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { colors } from '../theme/colors';
import { styles } from './RootNavigator.styles';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasHydrated = useLocationHasHydrated();
  const hasSavedLocation = useLocationStore((state) => state.location !== null);

  if (!hasHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primaryGreen} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={hasSavedLocation ? 'Home' : 'Onboarding'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

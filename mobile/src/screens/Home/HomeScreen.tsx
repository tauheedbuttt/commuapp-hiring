import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocationStore } from '../../store/locationStore';
import type { RootStackParamList } from '../../types';
import { HomeUI } from './HomeUI';

export function HomeScreen() {
  const location = useLocationStore((state) => state.location);
  const clearLocation = useLocationStore((state) => state.clearLocation);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();

  function handleClearStorage() {
    clearLocation();
    navigation.replace('Onboarding');
  }

  return <HomeUI location={location} onClearStorage={handleClearStorage} />;
}

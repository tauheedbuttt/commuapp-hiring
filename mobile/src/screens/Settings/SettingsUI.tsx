import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { colors } from '../../theme/colors';
import { styles } from './SettingsUI.styles';

const MIN_DISTANCE_KM = 1;
const MAX_DISTANCE_KM = 100;

type Props = {
  distanceKm: number;
  onDistanceKmChange: (km: number) => void;
};

export function SettingsUI({ distanceKm, onDistanceKmChange }: Props) {
  return (
    <ScreenContainer>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Max distance</Text>
          <View style={styles.valuePill}>
            <Text style={styles.valuePillText}>{Math.round(distanceKm)} km</Text>
          </View>
        </View>
        <Text style={styles.description}>
          Help posts and the area summary are pulled from within this distance of your home
          location.
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={MIN_DISTANCE_KM}
          maximumValue={MAX_DISTANCE_KM}
          step={1}
          value={distanceKm}
          onValueChange={onDistanceKmChange}
          minimumTrackTintColor={colors.primaryGreen}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primaryGreen}
        />
      </View>
    </ScreenContainer>
  );
}

import { View } from 'react-native';
import { Button } from '../Button/Button';
import { InlineMessage } from '../InlineMessage/InlineMessage';
import { Picker } from '../Picker/Picker';
import { TextField } from '../TextField/TextField';
import { styles } from './LocationForm.styles';

type Props = {
  country: string;
  city: string;
  countryOptions: readonly string[];
  onCityChange: (text: string) => void;
  onCountryChange: (country: string) => void;
  onGetCurrentLocation: () => void;
  gpsLoading: boolean;
  gpsError: string | null;
};

/** City/country fields + "use my GPS location", shared by Onboarding and Settings. */
export function LocationForm({
  country,
  city,
  countryOptions,
  onCityChange,
  onCountryChange,
  onGetCurrentLocation,
  gpsLoading,
  gpsError,
}: Props) {
  return (
    <View>
      <View style={styles.actions}>
        <Button
          label="Get current location"
          variant="outline"
          icon="location"
          onPress={onGetCurrentLocation}
          loading={gpsLoading}
        />
        {gpsError ? <InlineMessage>{gpsError}</InlineMessage> : null}
      </View>

      <View style={styles.fields}>
        <Picker label="Country" value={country} options={countryOptions} onChange={onCountryChange} />
        <TextField
          label="City"
          value={city}
          onChangeText={onCityChange}
          placeholder="Enter your city"
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

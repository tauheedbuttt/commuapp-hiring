import { Text, View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { InlineMessage } from '../../components/InlineMessage/InlineMessage';
import { Logo } from '../../components/Logo/Logo';
import { Picker } from '../../components/Picker/Picker';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { TextField } from '../../components/TextField/TextField';
import type { OnboardingUIProps } from '../../types';
import { styles } from './OnboardingUI.styles';

export function OnboardingUI({
  country,
  city,
  countryOptions,
  onCityChange,
  onCountryChange,
  onGetCurrentLocation,
  onSubmit,
  gpsLoading,
  gpsError,
  submitError,
  isSubmitting,
  isNextDisabled,
}: OnboardingUIProps) {
  return (
    <ScreenContainer>
      <Logo />

      <View style={styles.copyBlock}>
        <Text style={styles.heading}>Get started</Text>
        <Text style={styles.body}>
          Please fill in your home city and country. We only ask this information so that we can
          better serve you with the content that is relevant for you. Home city is also used as a
          fallback if GPS location is unavailable.
        </Text>
      </View>

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

      {submitError ? <InlineMessage>{submitError}</InlineMessage> : null}

      <View style={styles.footer}>
        <Button label="Next" onPress={onSubmit} disabled={isNextDisabled} loading={isSubmitting} />
      </View>
    </ScreenContainer>
  );
}

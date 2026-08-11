import { Text, View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { InlineMessage } from '../../components/InlineMessage/InlineMessage';
import { LocationForm } from '../../components/LocationForm/LocationForm';
import { Logo } from '../../components/Logo/Logo';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import { styles } from './OnboardingUI.styles';

type Props = {
  country: string;
  city: string;
  cityError?: string;
  countryOptions: readonly string[];
  onCityChange: (text: string) => void;
  onCountryChange: (country: string) => void;
  onGetCurrentLocation: () => void;
  onSubmit: () => void;
  gpsLoading: boolean;
  gpsError: string | null;
  submitError: string | null;
  isSubmitting: boolean;
  isNextDisabled: boolean;
};

export function OnboardingUI({
  country,
  city,
  cityError,
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
}: Props) {
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

      <View style={styles.form}>
        <LocationForm
          country={country}
          city={city}
          cityError={cityError}
          countryOptions={countryOptions}
          onCityChange={onCityChange}
          onCountryChange={onCountryChange}
          onGetCurrentLocation={onGetCurrentLocation}
          gpsLoading={gpsLoading}
          gpsError={gpsError}
        />
      </View>

      {submitError ? <InlineMessage>{submitError}</InlineMessage> : null}

      <View style={styles.footer}>
        <Button label="Next" onPress={onSubmit} disabled={isNextDisabled} loading={isSubmitting} />
      </View>
    </ScreenContainer>
  );
}

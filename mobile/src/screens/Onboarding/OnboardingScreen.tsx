import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { useLazyQuery } from '@apollo/client/react';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { GeocodeTownDocument } from '../../api/generated/graphql';
import { DEFAULT_COUNTRY } from '../../data/countries';
import { useLocationStore } from '../../store/locationStore';
import type { RootStackParamList } from '../../navigation/types';
import { CountryPicker } from '../../ui/CountryPicker/CountryPicker';
import { InlineMessage } from '../../ui/InlineMessage/InlineMessage';
import { Logo } from '../../ui/Logo/Logo';
import { OutlineButton } from '../../ui/OutlineButton/OutlineButton';
import { PrimaryButton } from '../../ui/PrimaryButton/PrimaryButton';
import { ScreenContainer } from '../../ui/ScreenContainer/ScreenContainer';
import { TextField } from '../../ui/TextField/TextField';
import { styles } from './OnboardingScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type GpsCoords = { latitude: number; longitude: number } | null;

export function OnboardingScreen({ navigation }: Props) {
  const setLocation = useLocationStore((state) => state.setLocation);

  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [city, setCity] = useState('');
  const [gpsCoords, setGpsCoords] = useState<GpsCoords>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [geocodeTown, { loading: geocodeLoading }] = useLazyQuery(GeocodeTownDocument);

  function handleCityChange(text: string) {
    setCity(text);
    setGpsCoords(null);
  }

  function handleCountryChange(next: string) {
    setCountry(next);
    setGpsCoords(null);
  }

  async function handleGetCurrentLocation() {
    setGpsError(null);
    setSubmitError(null);
    setGpsLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGpsError('Location permission denied. You can still enter your city manually.');
        return;
      }

      const position = await Location.getCurrentPositionAsync();
      const [address] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (!address?.city || !address?.country) {
        setGpsError("Couldn't determine your city from your location. Enter it manually instead.");
        return;
      }

      setCity(address.city);
      setCountry(address.country);
      setGpsCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    } catch {
      setGpsError("Couldn't determine your city from your location. Enter it manually instead.");
    } finally {
      setGpsLoading(false);
    }
  }

  async function handleSubmit() {
    setSubmitError(null);

    if (gpsCoords) {
      setLocation({ city, country, latitude: gpsCoords.latitude, longitude: gpsCoords.longitude });
      navigation.replace('Home');
      return;
    }

    const { data, error } = await geocodeTown({ variables: { town: `${city}, ${country}` } });

    if (error) {
      const category = CombinedGraphQLErrors.is(error)
        ? error.errors[0]?.extensions?.category
        : undefined;
      if (category === 'not_found') {
        setSubmitError("We couldn't find that city. Check the spelling or try a nearby city.");
      } else {
        setSubmitError("Something went wrong on our end. Please try again.");
      }
      return;
    }

    if (data) {
      setLocation({
        city,
        country,
        latitude: data.geocodeTown.latitude,
        longitude: data.geocodeTown.longitude,
      });
      navigation.replace('Home');
    }
  }

  const isSubmitting = geocodeLoading;
  const isNextDisabled = city.trim().length === 0 || isSubmitting;

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
        <OutlineButton
          label="Get current location"
          icon="location"
          onPress={handleGetCurrentLocation}
          loading={gpsLoading}
        />
        {gpsError ? <InlineMessage tone="error">{gpsError}</InlineMessage> : null}
      </View>

      <View style={styles.fields}>
        <CountryPicker label="Country" value={country} onChange={handleCountryChange} />
        <TextField
          label="City"
          value={city}
          onChangeText={handleCityChange}
          placeholder="Enter your city"
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      {submitError ? <InlineMessage tone="error">{submitError}</InlineMessage> : null}

      <View style={styles.footer}>
        <PrimaryButton
          label="Next"
          onPress={handleSubmit}
          disabled={isNextDisabled}
          loading={isSubmitting}
        />
      </View>
    </ScreenContainer>
  );
}

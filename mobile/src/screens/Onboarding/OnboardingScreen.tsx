import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { useLazyQuery } from '@apollo/client/react';
import * as Location from 'expo-location';
import { useState } from 'react';
import { GeocodeTownDocument } from '../../api/generated/graphql';
import { COUNTRY_NAMES, DEFAULT_COUNTRY } from '../../data/countries';
import { useLocationStore } from '../../store/locationStore';
import type { RootStackParamList } from '../../types';
import { OnboardingUI } from './OnboardingUI';

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
        setSubmitError('Something went wrong on our end. Please try again.');
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
    <OnboardingUI
      country={country}
      city={city}
      countryOptions={COUNTRY_NAMES}
      onCityChange={handleCityChange}
      onCountryChange={handleCountryChange}
      onGetCurrentLocation={handleGetCurrentLocation}
      onSubmit={handleSubmit}
      gpsLoading={gpsLoading}
      gpsError={gpsError}
      submitError={submitError}
      isSubmitting={isSubmitting}
      isNextDisabled={isNextDisabled}
    />
  );
}

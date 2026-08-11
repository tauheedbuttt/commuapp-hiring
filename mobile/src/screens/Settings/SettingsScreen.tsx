import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { COUNTRY_NAMES } from '../../data/countries';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useLocationForm } from '../../hooks/useLocationForm';
import { useLocationStore } from '../../store/locationStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { RootStackParamList } from '../../types';
import { SettingsUI } from './SettingsUI';

const DISTANCE_COMMIT_DELAY_MS = 400;

export function SettingsScreen() {
  const distance = useSettingsStore((state) => state.distance);
  const setDistance = useSettingsStore((state) => state.setDistance);
  const clearLocation = useLocationStore((state) => state.clearLocation);
  const locationForm = useLocationForm();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [justSavedLocation, setJustSavedLocation] = useState(false);
  const [isClearConfirmVisible, setIsClearConfirmVisible] = useState(false);
  const [distanceKm, setDistanceKm] = useState(distance / 1000);
  const debouncedDistanceKm = useDebouncedValue(distanceKm, DISTANCE_COMMIT_DELAY_MS);

  useEffect(() => {
    setDistance(Math.round(debouncedDistanceKm * 1000));
  }, [debouncedDistanceKm, setDistance]);

  function handleDistanceKmChange(km: number) {
    setDistanceKm(km);
  }

  function handleCityChange(text: string) {
    setJustSavedLocation(false);
    locationForm.handleCityChange(text);
  }

  function handleCountryChange(country: string) {
    setJustSavedLocation(false);
    locationForm.handleCountryChange(country);
  }

  async function handleSaveLocation() {
    const saved = await locationForm.handleSave();
    setJustSavedLocation(saved);
  }

  function handleConfirmClearLocation() {
    setIsClearConfirmVisible(false);
    clearLocation();
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>()?.replace('Onboarding');
  }

  return (
    <SettingsUI
      distanceKm={distanceKm}
      onDistanceKmChange={handleDistanceKmChange}
      country={locationForm.country}
      city={locationForm.city}
      countryOptions={COUNTRY_NAMES}
      onCityChange={handleCityChange}
      onCountryChange={handleCountryChange}
      onGetCurrentLocation={locationForm.handleGetCurrentLocation}
      gpsLoading={locationForm.gpsLoading}
      gpsError={locationForm.gpsError}
      submitError={locationForm.submitError}
      isSavingLocation={locationForm.isSaving}
      isSaveLocationDisabled={locationForm.isSaveDisabled}
      justSavedLocation={justSavedLocation}
      onSaveLocation={handleSaveLocation}
      isClearConfirmVisible={isClearConfirmVisible}
      onRequestClearLocation={() => setIsClearConfirmVisible(true)}
      onCancelClearLocation={() => setIsClearConfirmVisible(false)}
      onConfirmClearLocation={handleConfirmClearLocation}
    />
  );
}

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { COUNTRY_NAMES } from '../../data/countries';
import { useLocationForm } from '../../hooks/useLocationForm';
import { useLocationStore } from '../../store/locationStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { RootStackParamList } from '../../types';
import { SettingsUI } from './SettingsUI';

export function SettingsScreen() {
  const distance = useSettingsStore((state) => state.distance);
  const setDistance = useSettingsStore((state) => state.setDistance);
  const clearLocation = useLocationStore((state) => state.clearLocation);
  const locationForm = useLocationForm();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [justSavedLocation, setJustSavedLocation] = useState(false);
  const [isClearConfirmVisible, setIsClearConfirmVisible] = useState(false);

  function handleDistanceKmChange(km: number) {
    setDistance(Math.round(km * 1000));
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
      distanceKm={distance / 1000}
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

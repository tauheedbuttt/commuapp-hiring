import { useState } from 'react';
import { COUNTRY_NAMES } from '../../data/countries';
import { useLocationForm } from '../../hooks/useLocationForm';
import { useSettingsStore } from '../../store/settingsStore';
import { SettingsUI } from './SettingsUI';

export function SettingsScreen() {
  const distance = useSettingsStore((state) => state.distance);
  const setDistance = useSettingsStore((state) => state.setDistance);
  const locationForm = useLocationForm();
  const [justSavedLocation, setJustSavedLocation] = useState(false);

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
    />
  );
}

import { useLazyQuery } from '@apollo/client/react';
import * as Location from 'expo-location';
import { useState } from 'react';
import { getGraphQLErrorCategory } from '../api/errors';
import { GeocodeTownDocument } from '../api/generated/graphql';
import { DEFAULT_COUNTRY } from '../data/countries';
import { useLocationStore } from '../store/locationStore';

type GpsCoords = { latitude: number; longitude: number } | null;

/**
 * City/country fields + "use my GPS location" + geocode-and-persist, shared
 * by Onboarding (fresh setup) and Settings (changing an already-saved
 * location) — both resolve the same way, just with a different starting
 * point and a different action once saved.
 */
export function useLocationForm() {
  const savedLocation = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);

  const [country, setCountry] = useState(savedLocation?.country ?? DEFAULT_COUNTRY);
  const [city, setCity] = useState(savedLocation?.city ?? '');
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
      setGpsCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setGpsError("Couldn't determine your city from your location. Enter it manually instead.");
    } finally {
      setGpsLoading(false);
    }
  }

  /** Resolves the current fields (GPS coords if set, else geocoding) and persists to the location store. Returns whether it succeeded. */
  async function handleSave(): Promise<boolean> {
    setSubmitError(null);

    if (gpsCoords) {
      setLocation({ city, country, latitude: gpsCoords.latitude, longitude: gpsCoords.longitude });
      return true;
    }

    try {
      const { data } = await geocodeTown({ variables: { town: `${city}, ${country}` } });

      if (!data) return false;

      setLocation({ city, country, latitude: data.geocodeTown.latitude, longitude: data.geocodeTown.longitude });
      return true;
    } catch (error) {
      const category = getGraphQLErrorCategory(error);
      setSubmitError(
        category === 'not_found'
          ? "We couldn't find that city. Check the spelling or try a nearby city."
          : 'Something went wrong on our end. Please try again.',
      );
      return false;
    }
  }

  return {
    country,
    city,
    gpsLoading,
    gpsError,
    submitError,
    isSaving: geocodeLoading,
    isSaveDisabled: city.trim().length === 0 || geocodeLoading,
    handleCityChange,
    handleCountryChange,
    handleGetCurrentLocation,
    handleSave,
  };
}

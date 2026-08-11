import type { SavedLocation } from './location';

export type OnboardingUIProps = {
  country: string;
  city: string;
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

export type HomeUIProps = {
  location: SavedLocation | null;
};

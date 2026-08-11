import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { COUNTRY_NAMES } from "../../data/countries";
import { useLocationForm } from "../../hooks/useLocationForm";
import type { RootStackParamList } from "../../types";
import { OnboardingUI } from "./OnboardingUI";

type Props = NativeStackScreenProps<RootStackParamList, "Onboarding">;

export function OnboardingScreen({ navigation }: Props) {
  const form = useLocationForm();

  async function handleSubmit() {
    const saved = await form.handleSave();
    if (saved) {
      navigation.replace("MainTabs");
    }
  }

  return (
    <OnboardingUI
      country={form.country}
      city={form.city}
      cityError={form.cityError}
      countryOptions={COUNTRY_NAMES}
      onCityChange={form.handleCityChange}
      onCountryChange={form.handleCountryChange}
      onGetCurrentLocation={form.handleGetCurrentLocation}
      onSubmit={handleSubmit}
      gpsLoading={form.gpsLoading}
      gpsError={form.gpsError}
      submitError={form.submitError}
      isSubmitting={form.isSaving}
      isNextDisabled={form.isSaveDisabled}
    />
  );
}

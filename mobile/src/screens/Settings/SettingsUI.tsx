import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";
import { Button } from "../../components/Button/Button";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import { InlineMessage } from "../../components/InlineMessage/InlineMessage";
import { LocationForm } from "../../components/LocationForm/LocationForm";
import { ScreenContainer } from "../../components/ScreenContainer/ScreenContainer";
import { colors } from "../../theme/colors";
import { styles } from "./SettingsUI.styles";

const MIN_DISTANCE_KM = 1;
const MAX_DISTANCE_KM = 100;

type Props = {
  distanceKm: number;
  onDistanceKmChange: (km: number) => void;
  country: string;
  city: string;
  countryOptions: readonly string[];
  onCityChange: (text: string) => void;
  onCountryChange: (country: string) => void;
  onGetCurrentLocation: () => void;
  gpsLoading: boolean;
  gpsError: string | null;
  submitError: string | null;
  isSavingLocation: boolean;
  isSaveLocationDisabled: boolean;
  justSavedLocation: boolean;
  onSaveLocation: () => void;
  isClearConfirmVisible: boolean;
  onRequestClearLocation: () => void;
  onCancelClearLocation: () => void;
  onConfirmClearLocation: () => void;
};

export function SettingsUI({
  distanceKm,
  onDistanceKmChange,
  country,
  city,
  countryOptions,
  onCityChange,
  onCountryChange,
  onGetCurrentLocation,
  gpsLoading,
  gpsError,
  submitError,
  isSavingLocation,
  isSaveLocationDisabled,
  justSavedLocation,
  onSaveLocation,
  isClearConfirmVisible,
  onRequestClearLocation,
  onCancelClearLocation,
  onConfirmClearLocation,
}: Props) {
  return (
    <ScreenContainer edges={["top"]}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Max distance</Text>
          <View style={styles.valuePill}>
            <Text style={styles.valuePillText}>
              {Math.round(distanceKm)} km
            </Text>
          </View>
        </View>
        <Text style={styles.description}>
          Help posts and the area summary are pulled from within this distance
          of your home location.
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={MIN_DISTANCE_KM}
          maximumValue={MAX_DISTANCE_KM}
          step={1}
          value={distanceKm}
          onValueChange={onDistanceKmChange}
          minimumTrackTintColor={colors.primaryGreen}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.primaryGreen}
        />
      </View>

      <View style={[styles.card, styles.cardSpacing]}>
        <Text style={styles.cardTitle}>Home location</Text>
        <Text style={styles.description}>
          Help posts and the area summary are pulled from around this location.
        </Text>

        <View style={styles.locationForm}>
          <LocationForm
            country={country}
            city={city}
            countryOptions={countryOptions}
            onCityChange={onCityChange}
            onCountryChange={onCountryChange}
            onGetCurrentLocation={onGetCurrentLocation}
            gpsLoading={gpsLoading}
            gpsError={gpsError}
          />
        </View>

        {submitError ? <InlineMessage>{submitError}</InlineMessage> : null}
        {justSavedLocation ? (
          <InlineMessage variant="neutral">Location updated.</InlineMessage>
        ) : null}

        <View style={styles.saveLocationButton}>
          <Button
            label="Save location"
            onPress={onSaveLocation}
            disabled={isSaveLocationDisabled}
            loading={isSavingLocation}
          />
        </View>

        <View style={styles.clearLocationButton}>
          <Button label="Clear location" variant="danger-outline" onPress={onRequestClearLocation} />
        </View>
      </View>

      <ConfirmModal
        visible={isClearConfirmVisible}
        title="Clear your location?"
        message="This clears your saved home location and signs you out back to onboarding. You'll need to set your location again to use the app."
        confirmLabel="Clear location"
        danger
        onConfirm={onConfirmClearLocation}
        onCancel={onCancelClearLocation}
      />
    </ScreenContainer>
  );
}

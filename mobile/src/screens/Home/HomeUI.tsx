import { Text, View } from 'react-native';
import { Button } from '../../components/Button/Button';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import type { Location } from '../../types';
import { styles } from './HomeUI.styles';

type Props = {
  location: Location | null;
  onClearStorage: () => void;
};

/** Placeholder — help post list + area summary land in a later issue. */
export function HomeUI({ location, onClearStorage }: Props) {
  return (
    <ScreenContainer>
      <Text style={styles.text}>Home</Text>
      {/* TEMPORARY: dumps the onboarding-persisted location, plus a button to
          wipe it, so the full onboarding -> store -> Home flow (and re-running
          onboarding) is testable without reaching for a device's app settings.
          Remove both once real Home content (post list, area summary) replaces
          this screen. */}
      {location ? <Text style={styles.debug}>{JSON.stringify(location, null, 2)}</Text> : null}
      <View style={styles.clearButton}>
        <Button label="Clear storage (temp)" variant="outline" onPress={onClearStorage} />
      </View>
    </ScreenContainer>
  );
}

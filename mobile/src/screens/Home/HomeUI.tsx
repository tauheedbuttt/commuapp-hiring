import { Text } from 'react-native';
import { ScreenContainer } from '../../components/ScreenContainer/ScreenContainer';
import type { HomeUIProps } from '../../types';
import { styles } from './HomeUI.styles';

/** Placeholder — help post list + area summary land in a later issue. */
export function HomeUI({ location }: HomeUIProps) {
  return (
    <ScreenContainer>
      <Text style={styles.text}>Home</Text>
      {/* TEMPORARY: dumps the onboarding-persisted location so the full
          onboarding -> store -> Home flow is visible end-to-end. Remove once
          real Home content (post list, area summary) replaces this screen. */}
      {location ? <Text style={styles.debug}>{JSON.stringify(location, null, 2)}</Text> : null}
    </ScreenContainer>
  );
}

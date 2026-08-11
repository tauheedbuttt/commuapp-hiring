import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  error: {
    color: colors.errorRed,
  },
  neutral: {
    color: colors.textMuted,
  },
});

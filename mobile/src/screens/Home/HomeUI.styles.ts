import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  text: {
    marginTop: 48,
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  debug: {
    marginTop: 24,
    marginHorizontal: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EFEBDA',
    color: colors.textMuted,
    fontFamily: 'monospace',
    fontSize: 13,
  },
  clearButton: {
    marginTop: 24,
    marginHorizontal: 24,
  },
});

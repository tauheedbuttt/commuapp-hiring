import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    marginTop: 12,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  loadingLines: {
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.errorRed,
  },
});

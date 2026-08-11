import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  cardSpacing: {
    marginTop: 20,
  },
  locationForm: {
    marginTop: 16,
  },
  saveLocationButton: {
    marginTop: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  valuePill: {
    backgroundColor: colors.primaryGreen,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  valuePillText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  slider: {
    marginTop: 16,
    height: 40,
  },
});

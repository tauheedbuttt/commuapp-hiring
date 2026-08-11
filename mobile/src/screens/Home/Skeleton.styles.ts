import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  photoBlock: {
    height: 180,
    backgroundColor: colors.skeletonBase,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagBlock: {
    width: 90,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.skeletonBase,
  },
  lineBlock: {
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.skeletonBase,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBlock: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.skeletonBase,
  },
  summaryCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    gap: 12,
  },
});

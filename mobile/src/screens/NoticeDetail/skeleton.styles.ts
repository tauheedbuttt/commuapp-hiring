import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  imageBlock: {
    height: 240,
    borderRadius: 15,
    backgroundColor: colors.skeletonBase,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagBlock: {
    width: 100,
    height: 26,
    borderRadius: 999,
    backgroundColor: colors.skeletonBase,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBlock: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.skeletonBase,
  },
  lineBlock: {
    height: 14,
    borderRadius: 4,
    backgroundColor: colors.skeletonBase,
  },
});

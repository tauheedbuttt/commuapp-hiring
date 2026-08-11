import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  photo: {
    height: 180,
    justifyContent: 'flex-end',
    backgroundColor: colors.cardBackground,
  },
  photoImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    backgroundColor: 'rgba(20, 20, 20, 0.55)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  body: {
    padding: 16,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.tagNeutralBackground,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.tagNeutralText,
  },
  date: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textMuted,
  },
  ownerRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
  },
  ownerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  distance: {
    fontSize: 13,
    color: colors.textMuted,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
});

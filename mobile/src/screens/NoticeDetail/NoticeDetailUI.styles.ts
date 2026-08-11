import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  imageWrapper: {
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 15,
    backgroundColor: colors.cardBackground,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.tagNeutralBackground,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.tagNeutralText,
  },
  ownerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ownerRow: {
    flex: 1,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text,
  },
  metaValue: {
    fontWeight: '400',
    color: colors.text,
  },
  likeBlock: {
    alignItems: 'center',
    marginLeft: 12,
  },
  likeCount: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  inReturnCard: {
    backgroundColor: colors.tagGiveBackground,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  inReturnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inReturnLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text,
  },
  inReturnYes: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryGreen,
    marginLeft: 2,
  },
  mapWrapper: {
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: colors.cardBackground,
  },
  map: {
    flex: 1,
  },
  errorState: {
    marginTop: 24,
    gap: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
});

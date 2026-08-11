import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  footer: {
    paddingVertical: 20,
  },
  emptyState: {
    marginTop: 32,
    alignItems: 'center',
  },
  errorState: {
    marginTop: 24,
    gap: 12,
  },
  retryButton: {
    alignSelf: 'flex-start',
  },
});

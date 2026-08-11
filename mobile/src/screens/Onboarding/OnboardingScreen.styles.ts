import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  copyBlock: {
    marginTop: 48,
    gap: 16,
  },
  heading: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  actions: {
    marginTop: 40,
    gap: 10,
  },
  fields: {
    marginTop: 24,
    gap: 20,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 24,
  },
});

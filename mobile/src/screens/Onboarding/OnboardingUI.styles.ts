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
  form: {
    marginTop: 40,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 24,
  },
});

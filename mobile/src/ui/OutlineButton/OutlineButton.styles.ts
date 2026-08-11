import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  buttonPressed: {
    backgroundColor: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});

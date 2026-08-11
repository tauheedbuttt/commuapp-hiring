import { Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { TextFieldProps } from '../../types';
import { styles } from './TextField.styles';

export function TextField({ label, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.textMuted}
        {...inputProps}
      />
    </View>
  );
}

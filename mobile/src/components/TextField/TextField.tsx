import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../theme/colors';
import { styles } from './TextField.styles';

type Props = {
  label: string;
} & TextInputProps;

export function TextField({ label, ...inputProps }: Props) {
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
